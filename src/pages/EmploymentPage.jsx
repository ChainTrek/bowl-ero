import { useMemo, useState } from 'react'
import PublicPageShell from '../components/layout/PublicPageShell'
import PublicContentSection from '../components/layout/PublicContentSection'
import PublicTwoColumnLayout from '../components/layout/PublicTwoColumnLayout'
import PublicInfoPanel from '../components/public/PublicInfoPanel'
import { createEmploymentApplication } from '../services/supabase/publicEmployment'
import { EMPLOYMENT_STEPS } from '../constants/employmentSteps'
import EmploymentFormSection from '../components/employment/EmploymentFormSection'
import EmploymentStepContent from '../components/employment/EmploymentStepContent'
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

	const leftPanel = (
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
					const shouldReturnToReview = currentStep.key === 'signature' && !isReviewStep

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
	)

	const rightPanel = (
		<form className='employment-form public-form' onSubmit={handleSubmit}>
			<EmploymentFormSection
				title={currentStep.title}
				description={currentStep.description}
			>
				<EmploymentStepContent
					currentStep={currentStep}
					formData={formData}
					onChange={handleChange}
					onEditStep={stepIndex => goToStep(stepIndex, { returnToReview: true })}
				/>
			</EmploymentFormSection>

			{statusMessage && (
				<p className={isSuccess ? 'public-form__success' : 'public-form__error'}>
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
	)

	return (
		<PublicPageShell
			eyebrow='Join the Team'
			title='Employment Application'
			description='Fill out the application below if you are interested in working at Bowl-Ero.'
			mainClassName='employment-page'
		>
			<PublicContentSection>
				<PublicTwoColumnLayout
					className='employment-page__layout'
					leftClassName='employment-page__info public-card'
					rightClassName='employment-page__form-wrapper public-card'
					left={leftPanel}
					right={rightPanel}
				/>
			</PublicContentSection>
		</PublicPageShell>
	)
}