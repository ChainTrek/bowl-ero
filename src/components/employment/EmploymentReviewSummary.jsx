import EmploymentReviewSectionCard from './EmploymentReviewSectionCard'
import EmploymentReviewField from './EmploymentReviewField'

export default function EmploymentReviewSummary({ formData, onEditStep }) {
	return (
		<div className='employment-review-summary'>
			<EmploymentReviewSectionCard
				title='Personal Information'
				onEdit={() => onEditStep(0)}
				editLabel='Edit Personal Information'
			>
				<EmploymentReviewField label='Application Date' value={formData.application_date} />
				<EmploymentReviewField label='First Name' value={formData.first_name} />
				<EmploymentReviewField label='Last Name' value={formData.last_name} />
				<EmploymentReviewField label='Email' value={formData.email} />
				<EmploymentReviewField label='Phone' value={formData.phone} />
				<EmploymentReviewField label='Address' value={formData.address} />
				<EmploymentReviewField label='City' value={formData.city} />
				<EmploymentReviewField label='State' value={formData.state} />
				<EmploymentReviewField label='ZIP' value={formData.zip} />
			</EmploymentReviewSectionCard>

			<EmploymentReviewSectionCard
				title='Position Information'
				onEdit={() => onEditStep(1)}
				editLabel='Edit Position Information'
			>
				<EmploymentReviewField
					label='Position Applying For'
					value={formData.position_desired}
				/>
				<EmploymentReviewField label='Desired Salary' value={formData.desired_salary} />
				<EmploymentReviewField
					label='Employment Type'
					value={formData.employment_type}
				/>
				<EmploymentReviewField
					label='Available Start Date'
					value={formData.available_start_date}
				/>
				<EmploymentReviewField
					label='Legally Eligible to Work'
					value={formData.legally_eligible_to_work}
				/>
				<EmploymentReviewField label='Over 16' value={formData.over_16} />
				<EmploymentReviewField
					label='Food Handler’s Card'
					value={formData.has_food_handlers_card}
				/>
			</EmploymentReviewSectionCard>

			<EmploymentReviewSectionCard
				title='Background Information'
				onEdit={() => onEditStep(2)}
				editLabel='Edit Background Information'
			>
				<EmploymentReviewField
					label='Can Perform Essential Functions'
					value={formData.can_perform_essential_functions}
				/>
				<EmploymentReviewField
					label='Essential Functions Explanation'
					value={formData.essential_functions_explanation}
				/>
				<EmploymentReviewField
					label='Convictions'
					value={formData.has_convictions}
				/>
				<EmploymentReviewField
					label='Conviction Details'
					value={formData.conviction_details}
				/>
				<EmploymentReviewField
					label='Worked Here Before'
					value={formData.worked_here_before}
				/>
				<EmploymentReviewField
					label='Relatives or Friends at Company'
					value={formData.has_company_relatives_or_friends}
				/>
				<EmploymentReviewField
					label='Relatives/Friends Details'
					value={formData.company_relatives_or_friends_details}
				/>
				<EmploymentReviewField
					label='Days and Hours Available'
					value={formData.days_hours_available}
				/>
				<EmploymentReviewField
					label='Presently Employed'
					value={formData.presently_employed}
				/>
				<EmploymentReviewField
					label='Reason for Leaving Current Job'
					value={formData.reason_for_leaving_current_job}
				/>
				<EmploymentReviewField
					label='May Contact Current Employer'
					value={formData.may_contact_current_employer}
				/>
			</EmploymentReviewSectionCard>

			<EmploymentReviewSectionCard
				title='Education and Organizations'
				onEdit={() => onEditStep(3)}
				editLabel='Edit Education and Organizations'
			>
				<EmploymentReviewField
					label='Organizations / Memberships'
					value={formData.organizations_memberships}
				/>
				<EmploymentReviewField
					label='Special Training'
					value={formData.special_training}
				/>

				<EmploymentReviewField
					label='High School - Name and Location'
					value={formData.high_school_name}
				/>
				<EmploymentReviewField
					label='High School - Course of Study'
					value={formData.high_school_course_of_study}
				/>
				<EmploymentReviewField
					label='High School - Years Completed'
					value={formData.high_school_years_completed}
				/>
				<EmploymentReviewField
					label='High School - Diploma or Degree'
					value={formData.high_school_diploma_or_degree}
				/>

				<EmploymentReviewField
					label='College - Name and Location'
					value={formData.college_name}
				/>
				<EmploymentReviewField
					label='College - Course of Study'
					value={formData.college_course_of_study}
				/>
				<EmploymentReviewField
					label='College - Years Completed'
					value={formData.college_years_completed}
				/>
				<EmploymentReviewField
					label='College - Diploma or Degree'
					value={formData.college_diploma_or_degree}
				/>

				<EmploymentReviewField
					label='Trade School - Name and Location'
					value={formData.trade_school_name}
				/>
				<EmploymentReviewField
					label='Trade School - Course of Study'
					value={formData.trade_school_course_of_study}
				/>
				<EmploymentReviewField
					label='Trade School - Years Completed'
					value={formData.trade_school_years_completed}
				/>
				<EmploymentReviewField
					label='Trade School - Diploma or Degree'
					value={formData.trade_school_diploma_or_degree}
				/>

				<EmploymentReviewField
					label='Graduate Work - Name and Location'
					value={formData.graduate_work_name}
				/>
				<EmploymentReviewField
					label='Graduate Work - Course of Study'
					value={formData.graduate_work_course_of_study}
				/>
				<EmploymentReviewField
					label='Graduate Work - Years Completed'
					value={formData.graduate_work_years_completed}
				/>
				<EmploymentReviewField
					label='Graduate Work - Diploma or Degree'
					value={formData.graduate_work_diploma_or_degree}
				/>
			</EmploymentReviewSectionCard>

			<EmploymentReviewSectionCard
				title='Employment History and References'
				onEdit={() => onEditStep(4)}
				editLabel='Edit Employment History and References'
			>
				<EmploymentReviewField
					label='Employer 1 - Name'
					value={formData.employer_1_name}
				/>
				<EmploymentReviewField
					label='Employer 1 - Phone'
					value={formData.employer_1_phone}
				/>
				<EmploymentReviewField
					label='Employer 1 - Address'
					value={formData.employer_1_address}
				/>
				<EmploymentReviewField
					label='Employer 1 - Supervisor'
					value={formData.employer_1_supervisor}
				/>
				<EmploymentReviewField
					label='Employer 1 - Dates Employed'
					value={formData.employer_1_dates}
				/>
				<EmploymentReviewField
					label='Employer 1 - Reason for Leaving'
					value={formData.employer_1_reason_for_leaving}
				/>
				<EmploymentReviewField
					label='Employer 1 - Work Performed'
					value={formData.employer_1_work_performed}
				/>

				<EmploymentReviewField
					label='Employer 2 - Name'
					value={formData.employer_2_name}
				/>
				<EmploymentReviewField
					label='Employer 2 - Phone'
					value={formData.employer_2_phone}
				/>
				<EmploymentReviewField
					label='Employer 2 - Address'
					value={formData.employer_2_address}
				/>
				<EmploymentReviewField
					label='Employer 2 - Supervisor'
					value={formData.employer_2_supervisor}
				/>
				<EmploymentReviewField
					label='Employer 2 - Dates Employed'
					value={formData.employer_2_dates}
				/>
				<EmploymentReviewField
					label='Employer 2 - Reason for Leaving'
					value={formData.employer_2_reason_for_leaving}
				/>
				<EmploymentReviewField
					label='Employer 2 - Work Performed'
					value={formData.employer_2_work_performed}
				/>

				<EmploymentReviewField
					label='Reference 1 - Name'
					value={formData.reference_1_name}
				/>
				<EmploymentReviewField
					label='Reference 1 - Address'
					value={formData.reference_1_address}
				/>
				<EmploymentReviewField
					label='Reference 1 - Phone'
					value={formData.reference_1_phone}
				/>

				<EmploymentReviewField
					label='Reference 2 - Name'
					value={formData.reference_2_name}
				/>
				<EmploymentReviewField
					label='Reference 2 - Address'
					value={formData.reference_2_address}
				/>
				<EmploymentReviewField
					label='Reference 2 - Phone'
					value={formData.reference_2_phone}
				/>
			</EmploymentReviewSectionCard>
		</div>
	)
}