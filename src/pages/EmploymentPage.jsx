import { useMemo, useState } from 'react'
import PublicPageShell from '../components/layout/PublicPageShell'
import PublicInfoPanel from '../components/public/PublicInfoPanel'
import { createEmploymentApplication } from '../services/supabase/publicEmployment'
import { US_STATES } from '../constants/usStates'
import { POSITION_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from '../constants/employmentOptions'
import { EMPLOYMENT_STEPS } from '../constants/employmentSteps'
import EmploymentFormSection from '../components/employment/EmploymentFormSection'
import YesNoSelectField from '../components/employment/YesNoSelectField'
import SchoolFieldsBlock from '../components/employment/SchoolFieldsBlock'
import EmployerFieldsBlock from '../components/employment/EmployerFieldsBlock'
import ReferenceFieldsBlock from '../components/employment/ReferenceFieldsBlock'
import EmploymentReviewSummary from '../components/employment/EmploymentReviewSummary'
import { validateEmploymentForm } from '../utils/employment/validateEmploymentForm'
import { validateEmploymentStep } from '../utils/employment/validateEmploymentStep'
import { buildEmploymentPayload } from '../utils/employment/buildEmploymentPayload'

const initialForm = {
	application_date: '',
	first_name: '',
	last_name: '',
	email: '',
	phone: '',
	address: '',
	city: '',
	state: '',
	zip: '',
	position_desired: '',
	desired_salary: '',
	employment_type: '',
	available_start_date: '',
	legally_eligible_to_work: '',
	over_16: '',
	has_food_handlers_card: '',
	can_perform_essential_functions: '',
	essential_functions_explanation: '',
	has_convictions: '',
	conviction_details: '',
	worked_here_before: '',
	has_company_relatives_or_friends: '',
	company_relatives_or_friends_details: '',
	days_hours_available: '',
	presently_employed: '',
	reason_for_leaving_current_job: '',
	may_contact_current_employer: '',
	organizations_memberships: '',
	special_training: '',
	high_school_name: '',
	high_school_course_of_study: '',
	high_school_years_completed: '',
	high_school_diploma_or_degree: '',
	college_name: '',
	college_course_of_study: '',
	college_years_completed: '',
	college_diploma_or_degree: '',
	trade_school_name: '',
	trade_school_course_of_study: '',
	trade_school_years_completed: '',
	trade_school_diploma_or_degree: '',
	graduate_work_name: '',
	graduate_work_course_of_study: '',
	graduate_work_years_completed: '',
	graduate_work_diploma_or_degree: '',
	employer_1_name: '',
	employer_1_phone: '',
	employer_1_address: '',
	employer_1_supervisor: '',
	employer_1_dates: '',
	employer_1_reason_for_leaving: '',
	employer_1_work_performed: '',
	employer_2_name: '',
	employer_2_phone: '',
	employer_2_address: '',
	employer_2_supervisor: '',
	employer_2_dates: '',
	employer_2_reason_for_leaving: '',
	employer_2_work_performed: '',
	reference_1_name: '',
	reference_1_address: '',
	reference_1_phone: '',
	reference_2_name: '',
	reference_2_address: '',
	reference_2_phone: '',
	previous_experience: '',
	why_work_here: '',
	applicant_signature: '',
	applicant_signature_date: '',
	applicant_acknowledgement: false,
}

const employmentInfoItems = [
	{
		title: 'Before you begin',
		lines: [
			'Complete as much of the application as you can.',
			'The more accurate your information is, the easier it will be for Bowl-Ero to review your application.',
		],
	},
	{
		title: 'Privacy',
		lines: ['Social Security number is not collected through the online application.'],
	},
]

export default function EmploymentPage() {
	const [formData, setFormData] = useState(initialForm)
	const [currentStepIndex, setCurrentStepIndex] = useState(0)
	const [submitting, setSubmitting] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')
	const [isSuccess, setIsSuccess] = useState(false)
	const [returnToReview, setReturnToReview] = useState(false)

	const currentStep = useMemo(() => EMPLOYMENT_STEPS[currentStepIndex], [currentStepIndex])

	function handleChange(event) {
		const { name, value, type, checked } = event.target

		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	function goToStep(stepIndex, options = {}) {
		setCurrentStepIndex(stepIndex)
		setStatusMessage('')
		setReturnToReview(Boolean(options.returnToReview))
	}

	function handleNextStep() {
		const validationMessage = validateEmploymentStep(formData, currentStep.key)

		if (validationMessage) {
			setStatusMessage(validationMessage)
			setIsSuccess(false)
			return
		}

		setStatusMessage('')

		if (returnToReview) {
			const reviewStepIndex = EMPLOYMENT_STEPS.findIndex(step => step.key === 'signature')
			setCurrentStepIndex(reviewStepIndex)
			setReturnToReview(false)
			return
		}

		setCurrentStepIndex(prev => Math.min(prev + 1, EMPLOYMENT_STEPS.length - 1))
	}

	function handlePreviousStep() {
		setStatusMessage('')

		if (returnToReview) {
			const reviewStepIndex = EMPLOYMENT_STEPS.findIndex(step => step.key === 'signature')
			setCurrentStepIndex(reviewStepIndex)
			setReturnToReview(false)
			return
		}

		setCurrentStepIndex(prev => Math.max(prev - 1, 0))
	}

	async function handleSubmit(event) {
		event.preventDefault()

		const validationMessage = validateEmploymentForm(formData)

		if (validationMessage) {
			setStatusMessage(validationMessage)
			setIsSuccess(false)
			return
		}

		try {
			setSubmitting(true)
			setStatusMessage('')

			await createEmploymentApplication(buildEmploymentPayload(formData))

			setFormData(initialForm)
			setCurrentStepIndex(0)
			setReturnToReview(false)
			setStatusMessage('Your application has been submitted successfully.')
			setIsSuccess(true)
		} catch (error) {
			setStatusMessage(`Unable to submit application: ${error.message}`)
			setIsSuccess(false)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<PublicPageShell
			eyebrow='Join the Team'
			title='Employment Application'
			description='Fill out the application below if you are interested in working at Bowl-Ero.'
			mainClassName='employment-page'
		>
			<section className='public-section'>
				<div className='public-container'>
					<div className='employment-page__layout'>
						<div className='employment-page__info public-card'>
							<PublicInfoPanel
								eyebrow='Before You Begin'
								title='Application guide'
								description='Work through each section, review your answers, and submit when everything looks right.'
								items={employmentInfoItems}
							>
								<div className='employment-stepper'>
									{EMPLOYMENT_STEPS.map((step, index) => {
										const isActive = index === currentStepIndex
										const isComplete = index < currentStepIndex
										const isReviewStep = step.key === 'signature'
										const shouldReturnToReview =
											currentStep.key === 'signature' && !isReviewStep

										return (
											<button
												key={step.id}
												type='button'
												className={`employment-stepper__item ${
													isActive ? 'employment-stepper__item--active' : ''
												} ${isComplete ? 'employment-stepper__item--complete' : ''}`}
												onClick={() =>
													goToStep(index, {
														returnToReview: shouldReturnToReview,
													})
												}
											>
												<span className='employment-stepper__badge'>
													{isComplete ? '✓' : step.id}
												</span>

												<div className='employment-stepper__content'>
													<p className='employment-stepper__title'>{step.title}</p>

													{isActive && (
														<p className='employment-stepper__status'>Current section</p>
													)}

													{isComplete && !isActive && (
														<p className='employment-stepper__status employment-stepper__status--complete'>
															Completed
														</p>
													)}

													{shouldReturnToReview && !isActive && !isReviewStep && (
														<p className='employment-stepper__status employment-stepper__status--return'>
															Edit and return to review
														</p>
													)}
												</div>
											</button>
										)
									})}
								</div>
							</PublicInfoPanel>
						</div>

						<div className='employment-page__form-wrapper public-card'>
							<form className='employment-form' onSubmit={handleSubmit}>
								<EmploymentFormSection
									title={currentStep.title}
									description={currentStep.description}
								>
									{currentStep.key === 'personal' && (
										<>
											<div className='form-group'>
												<label htmlFor='application_date'>Application Date</label>
												<input
													id='application_date'
													name='application_date'
													type='date'
													value={formData.application_date}
													onChange={handleChange}
												/>
											</div>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='first_name'>First Name</label>
													<input
														id='first_name'
														name='first_name'
														type='text'
														value={formData.first_name}
														onChange={handleChange}
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='last_name'>Last Name</label>
													<input
														id='last_name'
														name='last_name'
														type='text'
														value={formData.last_name}
														onChange={handleChange}
													/>
												</div>
											</div>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='email'>Email</label>
													<input
														id='email'
														name='email'
														type='email'
														value={formData.email}
														onChange={handleChange}
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='phone'>Phone</label>
													<input
														id='phone'
														name='phone'
														type='tel'
														value={formData.phone}
														onChange={handleChange}
													/>
												</div>
											</div>

											<div className='form-group'>
												<label htmlFor='address'>Address</label>
												<input
													id='address'
													name='address'
													type='text'
													value={formData.address}
													onChange={handleChange}
												/>
											</div>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='city'>City</label>
													<input
														id='city'
														name='city'
														type='text'
														value={formData.city}
														onChange={handleChange}
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='state'>State</label>
													<select
														id='state'
														name='state'
														value={formData.state}
														onChange={handleChange}
													>
														<option value=''>Select a state</option>
														{US_STATES.map(state => (
															<option key={state.value} value={state.value}>
																{state.label}
															</option>
														))}
													</select>
												</div>
											</div>

											<div className='form-group'>
												<label htmlFor='zip'>ZIP</label>
												<input
													id='zip'
													name='zip'
													type='text'
													value={formData.zip}
													onChange={handleChange}
												/>
											</div>
										</>
									)}

									{currentStep.key === 'position' && (
										<>
											<div className='form-group'>
												<label htmlFor='position_desired'>Position Applying For</label>
												<select
													id='position_desired'
													name='position_desired'
													value={formData.position_desired}
													onChange={handleChange}
												>
													<option value=''>Select a position</option>
													{POSITION_OPTIONS.map(position => (
														<option key={position} value={position}>
															{position}
														</option>
													))}
												</select>
											</div>

											<div className='form-row'>
												<div className='form-group'>
													<label htmlFor='desired_salary'>Desired Salary</label>
													<input
														id='desired_salary'
														name='desired_salary'
														type='text'
														value={formData.desired_salary}
														onChange={handleChange}
													/>
												</div>

												<div className='form-group'>
													<label htmlFor='employment_type'>Employment Type</label>
													<select
														id='employment_type'
														name='employment_type'
														value={formData.employment_type}
														onChange={handleChange}
													>
														<option value=''>Select employment type</option>
														{EMPLOYMENT_TYPE_OPTIONS.map(type => (
															<option key={type} value={type}>
																{type}
															</option>
														))}
													</select>
												</div>
											</div>

											<div className='form-group'>
												<label htmlFor='available_start_date'>
													When are you available to begin work?
												</label>
												<input
													id='available_start_date'
													name='available_start_date'
													type='text'
													value={formData.available_start_date}
													onChange={handleChange}
												/>
											</div>

											<YesNoSelectField
												id='legally_eligible_to_work'
												name='legally_eligible_to_work'
												label='Are you legally eligible to work in the United States?'
												value={formData.legally_eligible_to_work}
												onChange={handleChange}
											/>

											<YesNoSelectField
												id='over_16'
												name='over_16'
												label='Are you over the age of 16?'
												value={formData.over_16}
												onChange={handleChange}
											/>

											<YesNoSelectField
												id='has_food_handlers_card'
												name='has_food_handlers_card'
												label='Do you have a Food Handler’s Card?'
												value={formData.has_food_handlers_card}
												onChange={handleChange}
											/>
										</>
									)}

									{currentStep.key === 'background' && (
										<>
											<YesNoSelectField
												id='can_perform_essential_functions'
												name='can_perform_essential_functions'
												label='Can you perform the essential functions of the position?'
												value={formData.can_perform_essential_functions}
												onChange={handleChange}
											/>

											{formData.can_perform_essential_functions === 'no' && (
												<div className='form-group'>
													<label htmlFor='essential_functions_explanation'>
														Please explain
													</label>
													<textarea
														id='essential_functions_explanation'
														name='essential_functions_explanation'
														rows='3'
														value={formData.essential_functions_explanation}
														onChange={handleChange}
													/>
												</div>
											)}

											<YesNoSelectField
												id='has_convictions'
												name='has_convictions'
												label='Have you been convicted of any law violations?'
												value={formData.has_convictions}
												onChange={handleChange}
											/>

											{formData.has_convictions === 'yes' && (
												<div className='form-group'>
													<label htmlFor='conviction_details'>Conviction Details</label>
													<textarea
														id='conviction_details'
														name='conviction_details'
														rows='3'
														value={formData.conviction_details}
														onChange={handleChange}
													/>
												</div>
											)}

											<YesNoSelectField
												id='worked_here_before'
												name='worked_here_before'
												label='Have you ever worked for this company before?'
												value={formData.worked_here_before}
												onChange={handleChange}
											/>

											<YesNoSelectField
												id='has_company_relatives_or_friends'
												name='has_company_relatives_or_friends'
												label='Do you have any relatives or friends who work for the company?'
												value={formData.has_company_relatives_or_friends}
												onChange={handleChange}
											/>

											{formData.has_company_relatives_or_friends === 'yes' && (
												<div className='form-group'>
													<label htmlFor='company_relatives_or_friends_details'>
														Please provide details
													</label>
													<textarea
														id='company_relatives_or_friends_details'
														name='company_relatives_or_friends_details'
														rows='3'
														value={formData.company_relatives_or_friends_details}
														onChange={handleChange}
													/>
												</div>
											)}

											<div className='form-group'>
												<label htmlFor='days_hours_available'>Days and Hours Available</label>
												<textarea
													id='days_hours_available'
													name='days_hours_available'
													rows='4'
													value={formData.days_hours_available}
													onChange={handleChange}
												/>
											</div>

											<YesNoSelectField
												id='presently_employed'
												name='presently_employed'
												label='Are you presently employed?'
												value={formData.presently_employed}
												onChange={handleChange}
											/>

											{formData.presently_employed === 'yes' && (
												<>
													<div className='form-group'>
														<label htmlFor='reason_for_leaving_current_job'>
															Why are you considering leaving?
														</label>
														<textarea
															id='reason_for_leaving_current_job'
															name='reason_for_leaving_current_job'
															rows='3'
															value={formData.reason_for_leaving_current_job}
															onChange={handleChange}
														/>
													</div>

													<YesNoSelectField
														id='may_contact_current_employer'
														name='may_contact_current_employer'
														label='May we contact your current employer?'
														value={formData.may_contact_current_employer}
														onChange={handleChange}
													/>
												</>
											)}
										</>
									)}

									{currentStep.key === 'education' && (
										<>
											<div className='form-group'>
												<label htmlFor='organizations_memberships'>
													Professional, trade, business, or civic organizations
												</label>
												<textarea
													id='organizations_memberships'
													name='organizations_memberships'
													rows='4'
													value={formData.organizations_memberships}
													onChange={handleChange}
												/>
											</div>

											<div className='form-group'>
												<label htmlFor='special_training'>
													Special courses, seminars, or training related to the position
												</label>
												<textarea
													id='special_training'
													name='special_training'
													rows='4'
													value={formData.special_training}
													onChange={handleChange}
												/>
											</div>

											<SchoolFieldsBlock
												title='High School'
												prefix='high_school'
												formData={formData}
												onChange={handleChange}
											/>

											<SchoolFieldsBlock
												title='College'
												prefix='college'
												formData={formData}
												onChange={handleChange}
											/>

											<SchoolFieldsBlock
												title='Vocational or Trade School'
												prefix='trade_school'
												formData={formData}
												onChange={handleChange}
											/>

											<SchoolFieldsBlock
												title='Graduate Work'
												prefix='graduate_work'
												formData={formData}
												onChange={handleChange}
											/>
										</>
									)}

									{currentStep.key === 'history' && (
										<>
											<EmployerFieldsBlock
												title='Most Recent Employer'
												prefix='employer_1'
												formData={formData}
												onChange={handleChange}
											/>

											<EmployerFieldsBlock
												title='Previous Employer'
												prefix='employer_2'
												formData={formData}
												onChange={handleChange}
											/>

											<ReferenceFieldsBlock
												title='Reference 1'
												prefix='reference_1'
												formData={formData}
												onChange={handleChange}
											/>

											<ReferenceFieldsBlock
												title='Reference 2'
												prefix='reference_2'
												formData={formData}
												onChange={handleChange}
											/>
										</>
									)}

									{currentStep.key === 'signature' && (
										<>
											<EmploymentReviewSummary formData={formData} />

											<div className='form-group'>
												<label htmlFor='previous_experience'>Previous Experience</label>
												<textarea
													id='previous_experience'
													name='previous_experience'
													rows='4'
													value={formData.previous_experience}
													onChange={handleChange}
												/>
											</div>

											<div className='form-group'>
												<label htmlFor='why_work_here'>Why would you like to work here?</label>
												<textarea
													id='why_work_here'
													name='why_work_here'
													rows='4'
													value={formData.why_work_here}
													onChange={handleChange}
												/>
											</div>

											<div className='form-group'>
												<label htmlFor='applicant_signature'>Type Your Full Name</label>
												<input
													id='applicant_signature'
													name='applicant_signature'
													type='text'
													value={formData.applicant_signature}
													onChange={handleChange}
												/>
											</div>

											<div className='form-group'>
												<label htmlFor='applicant_signature_date'>Signature Date</label>
												<input
													id='applicant_signature_date'
													name='applicant_signature_date'
													type='date'
													value={formData.applicant_signature_date}
													onChange={handleChange}
												/>
											</div>

											<div className='form-checkbox'>
												<label htmlFor='applicant_acknowledgement'>
													<input
														id='applicant_acknowledgement'
														name='applicant_acknowledgement'
														type='checkbox'
														checked={formData.applicant_acknowledgement}
														onChange={handleChange}
													/>
													I confirm that the information I entered is true to the best of my
													knowledge.
												</label>
											</div>
										</>
									)}
								</EmploymentFormSection>

								{statusMessage && (
									<p
										className={
											isSuccess ? 'employment-form__success' : 'employment-form__error'
										}
									>
										{statusMessage}
									</p>
								)}

								<div className='employment-form__actions'>
									{returnToReview ? (
										<button
											type='button'
											className='secondary-button'
											onClick={() => {
												const reviewStepIndex = EMPLOYMENT_STEPS.findIndex(
													step => step.key === 'signature',
												)
												goToStep(reviewStepIndex, { returnToReview: false })
											}}
										>
											Back to Review
										</button>
									) : (
										<button
											type='button'
											className='secondary-button'
											onClick={handlePreviousStep}
											disabled={currentStepIndex === 0}
										>
											Previous
										</button>
									)}

									{currentStepIndex < EMPLOYMENT_STEPS.length - 1 ? (
										<button type='button' onClick={handleNextStep}>
											{returnToReview ? 'Save and Return to Review' : 'Next Step'}
										</button>
									) : (
										<button type='submit' disabled={submitting}>
											{submitting ? 'Submitting...' : 'Submit Application'}
										</button>
									)}
								</div>

								{currentStep.key === 'signature' && (
									<div className='employment-form__review-links'>
										{EMPLOYMENT_STEPS.slice(0, -1).map((step, index) => (
											<button
												key={step.id}
												type='button'
												className='secondary-button'
												onClick={() => goToStep(index, { returnToReview: true })}
											>
												Edit {step.title}
											</button>
										))}
									</div>
								)}
							</form>
						</div>
					</div>
				</div>
			</section>
		</PublicPageShell>
	)
}