import bowleroLogo from '../../assets/bowlero-logo.png'

function displayValue(value) {
	if (value === null || value === undefined || value === '') {
		return ''
	}

	return String(value)
}

function displayBoolean(value) {
	if (value === null || value === undefined) {
		return ''
	}

	return value ? 'YES' : 'NO'
}

function formatPrintDate(value) {
	if (!value) {
		return ''
	}

	const date = new Date(`${value}T00:00:00`)

	if (Number.isNaN(date.getTime())) {
		return value
	}

	return date.toLocaleDateString('en-US', {
		month: '2-digit',
		day: '2-digit',
		year: 'numeric',
	})
}

function PrintField({ label, value, className = '' }) {
	return (
		<div className={`application-print__field ${className}`.trim()}>
			<span className='application-print__label'>{label}</span>
			<span className='application-print__line'>{displayValue(value)}</span>
		</div>
	)
}

function PrintChoice({ label, value, className = '' }) {
	return (
		<div className={`application-print__choice ${className}`.trim()}>
			<span className='application-print__label'>{label}</span>
			<span className='application-print__line'>{displayBoolean(value)}</span>
		</div>
	)
}

function PrintTextBlock({ label, value, tall = false, className = '' }) {
	return (
		<div
			className={`application-print__text-block ${
				tall ? 'application-print__text-block--tall' : ''
			} ${className}`.trim()}
		>
			<span className='application-print__label'>{label}</span>
			<div className='application-print__box'>{displayValue(value)}</div>
		</div>
	)
}

function PrintSection({ title, className = '', children }) {
	return (
		<section className={`application-print__section ${className}`.trim()}>
			<h2 className='application-print__section-title'>{title}</h2>
			{children}
		</section>
	)
}

export default function EmploymentApplicationPrintTemplate({ application }) {
	if (!application) {
		return null
	}

	return (
		<div className='application-print'>
			<header className='application-print__header'>
				<div className='application-print__header-brand'>
					<img className='application-print__logo' src={bowleroLogo} alt='Bowlero logo' />
					<div className='application-print__header-text'>
						<h1>Bowl-Ero Lanes</h1>
						<h2>Employment Application</h2>
					</div>
				</div>
			</header>

			<PrintSection title='Personal Information'>
				<div className='application-print__row application-print__row--top-line'>
					<PrintField
						label='Name'
						value={`${displayValue(application.first_name)} ${displayValue(
							application.last_name,
						)}`.trim()}
					/>
					<PrintField label='Phone Number' value={application.phone} />
					<PrintField label='Email Address' value={application.email} />
					<PrintField
						label='Date'
						value={formatPrintDate(application.application_date)}
						className='application-print__field--date'
					/>
				</div>

				<div className='application-print__row application-print__row--address-line'>
					<PrintField label='Address' value={application.address} />
					<PrintField label='City' value={application.city} />
					<PrintField label='State' value={application.state} />
					<PrintField label='Zip Code' value={application.zip} />
				</div>

				<div className='application-print__row application-print__row--position-line'>
					<PrintField label='Position Applied For' value={application.position_desired} />
					<PrintField label='Desired Salary' value={application.desired_salary} />
					<PrintField label='Employment Type' value={application.employment_type} />
					<PrintField label='Available to Begin Work' value={application.available_start_date} />
				</div>

				<div className='application-print__row'>
					<PrintField
						label='Food Handler’s Card'
						value={displayBoolean(application.has_food_handlers_card)}
					/>
				</div>
			</PrintSection>

			<PrintSection title='Employment Questions' className='application-print__section--employment-questions'>
				<div className='application-print__row application-print__row--3'>
					<PrintChoice
						label='Can Perform Essential Functions'
						value={application.can_perform_essential_functions}
					/>
					<PrintChoice
						label='Legally Eligible to Work in the U.S.'
						value={application.legally_eligible_to_work}
					/>
					<PrintChoice label='Over Age 16' value={application.over_16} />
				</div>

				<PrintTextBlock
					label='If No, Explain Essential Functions Issue'
					value={application.essential_functions_explanation}
				/>

				<div className='application-print__row application-print__row--3'>
					<PrintChoice label='Convictions' value={application.has_convictions} />
					<PrintChoice label='Worked Here Before' value={application.worked_here_before} />
					<PrintChoice
						label='Relatives or Friends at Company'
						value={application.has_company_relatives_or_friends}
					/>
				</div>

				<PrintTextBlock label='Conviction Details' value={application.conviction_details} />

				<PrintTextBlock
					label='Relatives / Friends Details'
					value={application.company_relatives_or_friends_details}
				/>

				<PrintTextBlock label='Days and Hours Available' value={application.days_hours_available} tall />

				<div className='application-print__row application-print__row--2'>
					<PrintChoice label='Presently Employed' value={application.presently_employed} />
					<PrintChoice
						label='May Contact Current Employer'
						value={application.may_contact_current_employer}
					/>
				</div>

				<PrintTextBlock
					label='Why Are You Considering Leaving?'
					value={application.reason_for_leaving_current_job}
				/>

				<PrintTextBlock
					label='Professional / Trade / Business / Civic Organizations'
					value={application.organizations_memberships}
				/>
			</PrintSection>

			<PrintSection title='Education' className='application-print__section--education'>
				<div className='application-print__education-table'>
					<div className='application-print__education-head'>
						<span>&nbsp;</span>
						<span>Name and Location of School</span>
						<span>Course of Study</span>
						<span>Years Completed</span>
						<span>Diploma or Degree</span>
					</div>

					<div className='application-print__education-row'>
						<strong>High School</strong>
						<span>{displayValue(application.high_school_name)}</span>
						<span>{displayValue(application.high_school_course_of_study)}</span>
						<span>{displayValue(application.high_school_years_completed)}</span>
						<span>{displayValue(application.high_school_diploma_or_degree)}</span>
					</div>

					<div className='application-print__education-row'>
						<strong>College</strong>
						<span>{displayValue(application.college_name)}</span>
						<span>{displayValue(application.college_course_of_study)}</span>
						<span>{displayValue(application.college_years_completed)}</span>
						<span>{displayValue(application.college_diploma_or_degree)}</span>
					</div>

					<div className='application-print__education-row'>
						<strong>Vocational / Trade School</strong>
						<span>{displayValue(application.trade_school_name)}</span>
						<span>{displayValue(application.trade_school_course_of_study)}</span>
						<span>{displayValue(application.trade_school_years_completed)}</span>
						<span>{displayValue(application.trade_school_diploma_or_degree)}</span>
					</div>

					<div className='application-print__education-row'>
						<strong>Graduate Work</strong>
						<span>{displayValue(application.graduate_work_name)}</span>
						<span>{displayValue(application.graduate_work_course_of_study)}</span>
						<span>{displayValue(application.graduate_work_years_completed)}</span>
						<span>{displayValue(application.graduate_work_diploma_or_degree)}</span>
					</div>
				</div>

				<PrintTextBlock
					label='Special Courses, Seminars, or Training Related to the Position'
					value={application.special_training}
				/>
			</PrintSection>

			<PrintSection title='Employment History' className='application-print__section--employment-history'>
				<div className='application-print__job-block'>
					<h3>Current or Most Recent Employer</h3>

					<div className='application-print__row application-print__row--2'>
						<PrintField label='Employer Name' value={application.employer_1_name} />
						<PrintField label='Telephone Number' value={application.employer_1_phone} />
					</div>

					<div className='application-print__row application-print__row--2'>
						<PrintField label='Full Address' value={application.employer_1_address} />
						<PrintField label='Supervisor Name and Title' value={application.employer_1_supervisor} />
					</div>

					<div className='application-print__row application-print__row--2'>
						<PrintField label='Dates Employed' value={application.employer_1_dates} />
						<PrintField
							label='Reason for Leaving'
							value={application.employer_1_reason_for_leaving}
						/>
					</div>

					<PrintTextBlock
						label='Describe the Work Performed'
						value={application.employer_1_work_performed}
						tall
					/>
				</div>

				<div className='application-print__job-block'>
					<h3>Previous Employer</h3>

					<div className='application-print__row application-print__row--2'>
						<PrintField label='Employer Name' value={application.employer_2_name} />
						<PrintField label='Telephone Number' value={application.employer_2_phone} />
					</div>

					<div className='application-print__row application-print__row--2'>
						<PrintField label='Full Address' value={application.employer_2_address} />
						<PrintField label='Supervisor Name and Title' value={application.employer_2_supervisor} />
					</div>

					<div className='application-print__row application-print__row--2'>
						<PrintField label='Dates Employed' value={application.employer_2_dates} />
						<PrintField
							label='Reason for Leaving'
							value={application.employer_2_reason_for_leaving}
						/>
					</div>

					<PrintTextBlock
						label='Describe the Work Performed'
						value={application.employer_2_work_performed}
						tall
					/>
				</div>
			</PrintSection>

			<PrintSection title='Personal References' className='application-print__section--references'>
				<div className='application-print__reference-block'>
					<div className='application-print__row application-print__row--2'>
						<PrintField label='Name' value={application.reference_1_name} />
						<PrintField label='Telephone Number' value={application.reference_1_phone} />
					</div>

					<div className='application-print__row'>
						<PrintField label='Full Address' value={application.reference_1_address} />
					</div>
				</div>

				<div className='application-print__reference-block'>
					<div className='application-print__row application-print__row--2'>
						<PrintField label='Name' value={application.reference_2_name} />
						<PrintField label='Telephone Number' value={application.reference_2_phone} />
					</div>

					<div className='application-print__row'>
						<PrintField label='Full Address' value={application.reference_2_address} />
					</div>
				</div>
			</PrintSection>

			<PrintSection title='Applicant Statement' className='application-print__section--applicant-statement'>
				<PrintTextBlock label='Previous Experience' value={application.previous_experience} tall />

				<PrintTextBlock label='Why Would You Like to Work Here?' value={application.why_work_here} tall />

				<div className='application-print__row application-print__row--2'>
					<PrintField label='Signed' value={application.applicant_signature} />
					<PrintField label='Date' value={formatPrintDate(application.applicant_signature_date)} />
				</div>
			</PrintSection>

			<PrintSection title='Employer Use Only' className='application-print__section--employer-use'>
				<div className='application-print__employer-note'>Do not write below this line.</div>
			</PrintSection>
		</div>
	)
}
