import { US_STATES } from '../../constants/usStates'
import {
	POSITION_OPTIONS,
	EMPLOYMENT_TYPE_OPTIONS,
} from '../../constants/employmentOptions'
import YesNoSelectField from './YesNoSelectField'
import SchoolFieldsBlock from './SchoolFieldsBlock'
import EmployerFieldsBlock from './EmployerFieldsBlock'
import ReferenceFieldsBlock from './ReferenceFieldsBlock'
import EmploymentReviewSummary from './EmploymentReviewSummary'

export default function EmploymentStepContent({
	currentStep,
	formData,
	onChange,
	onEditStep,
}) {
	switch (currentStep.key) {
		case 'personal':
			return (
				<>
					<div className='form-group'>
						<label htmlFor='application_date'>Application Date</label>
						<input
							id='application_date'
							name='application_date'
							type='date'
							value={formData.application_date}
							onChange={onChange}
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
								onChange={onChange}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='last_name'>Last Name</label>
							<input
								id='last_name'
								name='last_name'
								type='text'
								value={formData.last_name}
								onChange={onChange}
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
								onChange={onChange}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='phone'>Phone</label>
							<input
								id='phone'
								name='phone'
								type='tel'
								value={formData.phone}
								onChange={onChange}
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
							onChange={onChange}
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
								onChange={onChange}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='state'>State</label>
							<select
								id='state'
								name='state'
								value={formData.state}
								onChange={onChange}
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
							onChange={onChange}
						/>
					</div>
				</>
			)

		case 'position':
			return (
				<>
					<div className='form-group'>
						<label htmlFor='position_desired'>Position Applying For</label>
						<select
							id='position_desired'
							name='position_desired'
							value={formData.position_desired}
							onChange={onChange}
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
								onChange={onChange}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='employment_type'>Employment Type</label>
							<select
								id='employment_type'
								name='employment_type'
								value={formData.employment_type}
								onChange={onChange}
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
							onChange={onChange}
						/>
					</div>

					<YesNoSelectField
						id='legally_eligible_to_work'
						name='legally_eligible_to_work'
						label='Are you legally eligible to work in the United States?'
						value={formData.legally_eligible_to_work}
						onChange={onChange}
					/>

					<YesNoSelectField
						id='over_16'
						name='over_16'
						label='Are you over the age of 16?'
						value={formData.over_16}
						onChange={onChange}
					/>

					<YesNoSelectField
						id='has_food_handlers_card'
						name='has_food_handlers_card'
						label='Do you have a Food Handler’s Card?'
						value={formData.has_food_handlers_card}
						onChange={onChange}
					/>
				</>
			)

		case 'background':
			return (
				<>
					<YesNoSelectField
						id='can_perform_essential_functions'
						name='can_perform_essential_functions'
						label='Can you perform the essential functions of the position?'
						value={formData.can_perform_essential_functions}
						onChange={onChange}
					/>

					{formData.can_perform_essential_functions === 'no' && (
						<div className='form-group'>
							<label htmlFor='essential_functions_explanation'>Please explain</label>
							<textarea
								id='essential_functions_explanation'
								name='essential_functions_explanation'
								rows='3'
								value={formData.essential_functions_explanation}
								onChange={onChange}
							/>
						</div>
					)}

					<YesNoSelectField
						id='has_convictions'
						name='has_convictions'
						label='Have you been convicted of any law violations?'
						value={formData.has_convictions}
						onChange={onChange}
					/>

					{formData.has_convictions === 'yes' && (
						<div className='form-group'>
							<label htmlFor='conviction_details'>Conviction Details</label>
							<textarea
								id='conviction_details'
								name='conviction_details'
								rows='3'
								value={formData.conviction_details}
								onChange={onChange}
							/>
						</div>
					)}

					<YesNoSelectField
						id='worked_here_before'
						name='worked_here_before'
						label='Have you ever worked for this company before?'
						value={formData.worked_here_before}
						onChange={onChange}
					/>

					<YesNoSelectField
						id='has_company_relatives_or_friends'
						name='has_company_relatives_or_friends'
						label='Do you have any relatives or friends who work for the company?'
						value={formData.has_company_relatives_or_friends}
						onChange={onChange}
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
								onChange={onChange}
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
							onChange={onChange}
						/>
					</div>

					<YesNoSelectField
						id='presently_employed'
						name='presently_employed'
						label='Are you presently employed?'
						value={formData.presently_employed}
						onChange={onChange}
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
									onChange={onChange}
								/>
							</div>

							<YesNoSelectField
								id='may_contact_current_employer'
								name='may_contact_current_employer'
								label='May we contact your current employer?'
								value={formData.may_contact_current_employer}
								onChange={onChange}
							/>
						</>
					)}
				</>
			)

		case 'education':
			return (
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
							onChange={onChange}
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
							onChange={onChange}
						/>
					</div>

					<SchoolFieldsBlock
						title='High School'
						prefix='high_school'
						formData={formData}
						onChange={onChange}
					/>

					<SchoolFieldsBlock
						title='College'
						prefix='college'
						formData={formData}
						onChange={onChange}
					/>

					<SchoolFieldsBlock
						title='Vocational or Trade School'
						prefix='trade_school'
						formData={formData}
						onChange={onChange}
					/>

					<SchoolFieldsBlock
						title='Graduate Work'
						prefix='graduate_work'
						formData={formData}
						onChange={onChange}
					/>
				</>
			)

		case 'history':
			return (
				<>
					<EmployerFieldsBlock
						title='Most Recent Employer'
						prefix='employer_1'
						formData={formData}
						onChange={onChange}
					/>

					<EmployerFieldsBlock
						title='Previous Employer'
						prefix='employer_2'
						formData={formData}
						onChange={onChange}
					/>

					<ReferenceFieldsBlock
						title='Reference 1'
						prefix='reference_1'
						formData={formData}
						onChange={onChange}
					/>

					<ReferenceFieldsBlock
						title='Reference 2'
						prefix='reference_2'
						formData={formData}
						onChange={onChange}
					/>
				</>
			)

		case 'signature':
			return (
				<>
					<EmploymentReviewSummary
						formData={formData}
						onEditStep={stepIndex => onEditStep(stepIndex)}
					/>

					<div className='form-group'>
						<label htmlFor='previous_experience'>Previous Experience</label>
						<textarea
							id='previous_experience'
							name='previous_experience'
							rows='4'
							value={formData.previous_experience}
							onChange={onChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='why_work_here'>Why would you like to work here?</label>
						<textarea
							id='why_work_here'
							name='why_work_here'
							rows='4'
							value={formData.why_work_here}
							onChange={onChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='applicant_signature'>Type Your Full Name</label>
						<input
							id='applicant_signature'
							name='applicant_signature'
							type='text'
							value={formData.applicant_signature}
							onChange={onChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='applicant_signature_date'>Signature Date</label>
						<input
							id='applicant_signature_date'
							name='applicant_signature_date'
							type='date'
							value={formData.applicant_signature_date}
							onChange={onChange}
						/>
					</div>

					<div className='form-checkbox'>
						<label htmlFor='applicant_acknowledgement'>
							<input
								id='applicant_acknowledgement'
								name='applicant_acknowledgement'
								type='checkbox'
								checked={formData.applicant_acknowledgement}
								onChange={onChange}
							/>
							I confirm that the information I entered is true to the best of my
							knowledge.
						</label>
					</div>
				</>
			)

		default:
			return null
	}
}