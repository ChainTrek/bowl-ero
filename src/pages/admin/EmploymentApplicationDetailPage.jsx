import { Link, useOutletContext, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
	getEmploymentApplicationById,
	markEmploymentApplicationReviewed,
} from '../../services/supabase/employmentApplications'
import { formatDateTime } from '../../utils/formatDateTime'
import EmploymentApplicationPrintTemplate from '../../components/employment/EmploymentApplicationPrintTemplate'

function displayValue(value) {
	if (value === null || value === undefined || value === '') {
		return 'Not provided'
	}

	return value
}

function displayBoolean(value) {
	if (value === null || value === undefined) {
		return 'Not provided'
	}

	return value ? 'Yes' : 'No'
}

export default function EmploymentApplicationDetailPage() {
	const { id } = useParams()
	const { refreshCounts } = useOutletContext()
	const [application, setApplication] = useState(null)
	const [loading, setLoading] = useState(true)
	const [markingReviewed, setMarkingReviewed] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')

	useEffect(() => {
		loadApplication()
	}, [id])

	async function loadApplication() {
		try {
			setLoading(true)
			setStatusMessage('')

			const data = await getEmploymentApplicationById(id)
			setApplication(data ?? null)
		} catch (error) {
			setStatusMessage(`Error loading application: ${error.message}`)
		} finally {
			setLoading(false)
		}
	}

	async function handleMarkReviewed() {
		if (!application || application.reviewed) return

		try {
			setMarkingReviewed(true)
			setStatusMessage('')

			const updatedApplication = await markEmploymentApplicationReviewed(id)

			setApplication(updatedApplication)
			await refreshCounts()

			setStatusMessage('Application marked as reviewed.')
		} catch (error) {
			setStatusMessage(`Error updating application: ${error.message}`)
		} finally {
			setMarkingReviewed(false)
		}
	}

	function handlePrint() {
		window.print()
	}

	return (
		<section className='admin-page employment-application-detail-page'>
			<div className='admin-page__header employment-application-detail-page__header no-print'>
				<div>
					<h1>Application Details</h1>
					<p>Review the submitted employment application in full.</p>
				</div>

				<div className='employment-application-detail-page__actions'>
					{application && !application.reviewed && (
						<button
							type='button'
							className='edit-button'
							onClick={handleMarkReviewed}
							disabled={markingReviewed}
						>
							{markingReviewed ? 'Saving...' : 'Mark as Reviewed'}
						</button>
					)}

					<button
						type='button'
						className='secondary-button'
						onClick={handlePrint}
					>
						Print Application
					</button>

					<Link to='/admin/applications' className='secondary-button'>
						Back to Applications
					</Link>
				</div>
			</div>

			{statusMessage && <p className='status-message'>{statusMessage}</p>}

			{loading ? (
				<div className='admin-card'>
					<p>Loading application...</p>
				</div>
			) : !application ? (
				<div className='admin-card'>
					<p>Application not found.</p>
				</div>
			) : (
				<>
					<div className='screen-only'>
						<div className='employment-application-detail'>
							<div className='admin-card employment-application-detail__hero application-print-header'>
								<p className='application-print-header__eyebrow'>Bowl-Ero Lanes</p>
								<h2>Employment Application</h2>
								<p>
									Applicant: {application.first_name} {application.last_name}
								</p>
								<p>Submitted: {formatDateTime(application.created_at)}</p>
								<p>Status: {application.reviewed ? 'Reviewed' : 'New Application'}</p>
								{application.reviewed && application.reviewed_at && (
									<p>Reviewed: {formatDateTime(application.reviewed_at)}</p>
								)}
							</div>

							<div className='admin-card'>
								<h2>Personal Information</h2>
								<div className='employment-detail-grid'>
									<div><strong>Application Date</strong><p>{displayValue(application.application_date)}</p></div>
									<div><strong>First Name</strong><p>{displayValue(application.first_name)}</p></div>
									<div><strong>Last Name</strong><p>{displayValue(application.last_name)}</p></div>
									<div><strong>Email</strong><p>{displayValue(application.email)}</p></div>
									<div><strong>Phone</strong><p>{displayValue(application.phone)}</p></div>
									<div><strong>Address</strong><p>{displayValue(application.address)}</p></div>
									<div><strong>City</strong><p>{displayValue(application.city)}</p></div>
									<div><strong>State</strong><p>{displayValue(application.state)}</p></div>
									<div><strong>ZIP</strong><p>{displayValue(application.zip)}</p></div>
								</div>
							</div>

							<div className='admin-card'>
								<h2>Position Information</h2>
								<div className='employment-detail-grid'>
									<div><strong>Position Applying For</strong><p>{displayValue(application.position_desired)}</p></div>
									<div><strong>Desired Salary</strong><p>{displayValue(application.desired_salary)}</p></div>
									<div><strong>Employment Type</strong><p>{displayValue(application.employment_type)}</p></div>
									<div><strong>Available Start Date</strong><p>{displayValue(application.available_start_date)}</p></div>
									<div><strong>Legally Eligible to Work</strong><p>{displayValue(application.legally_eligible_to_work)}</p></div>
									<div><strong>Over 16</strong><p>{displayValue(application.over_16)}</p></div>
									<div><strong>Food Handler&apos;s Card</strong><p>{displayValue(application.has_food_handlers_card)}</p></div>
								</div>
							</div>

							<div className='admin-card'>
								<h2>Background Information</h2>
								<div className='employment-detail-grid'>
									<div><strong>Can Perform Essential Functions</strong><p>{displayValue(application.can_perform_essential_functions)}</p></div>
									<div><strong>Essential Functions Explanation</strong><p>{displayValue(application.essential_functions_explanation)}</p></div>
									<div><strong>Has Convictions</strong><p>{displayValue(application.has_convictions)}</p></div>
									<div><strong>Conviction Details</strong><p>{displayValue(application.conviction_details)}</p></div>
									<div><strong>Worked Here Before</strong><p>{displayValue(application.worked_here_before)}</p></div>
									<div><strong>Relatives or Friends at Company</strong><p>{displayValue(application.has_company_relatives_or_friends)}</p></div>
									<div><strong>Relatives/Friends Details</strong><p>{displayValue(application.company_relatives_or_friends_details)}</p></div>
									<div><strong>Days and Hours Available</strong><p>{displayValue(application.days_hours_available)}</p></div>
									<div><strong>Presently Employed</strong><p>{displayValue(application.presently_employed)}</p></div>
									<div><strong>Reason for Leaving Current Job</strong><p>{displayValue(application.reason_for_leaving_current_job)}</p></div>
									<div><strong>May Contact Current Employer</strong><p>{displayValue(application.may_contact_current_employer)}</p></div>
								</div>
							</div>

							<div className='admin-card'>
								<h2>Education and Organizations</h2>
								<div className='employment-detail-grid'>
									<div><strong>Organizations / Memberships</strong><p>{displayValue(application.organizations_memberships)}</p></div>
									<div><strong>Special Training</strong><p>{displayValue(application.special_training)}</p></div>
									<div><strong>High School Name</strong><p>{displayValue(application.high_school_name)}</p></div>
									<div><strong>High School Course of Study</strong><p>{displayValue(application.high_school_course_of_study)}</p></div>
									<div><strong>High School Years Completed</strong><p>{displayValue(application.high_school_years_completed)}</p></div>
									<div><strong>High School Diploma / Degree</strong><p>{displayValue(application.high_school_diploma_or_degree)}</p></div>
									<div><strong>College Name</strong><p>{displayValue(application.college_name)}</p></div>
									<div><strong>College Course of Study</strong><p>{displayValue(application.college_course_of_study)}</p></div>
									<div><strong>College Years Completed</strong><p>{displayValue(application.college_years_completed)}</p></div>
									<div><strong>College Diploma / Degree</strong><p>{displayValue(application.college_diploma_or_degree)}</p></div>
									<div><strong>Trade School Name</strong><p>{displayValue(application.trade_school_name)}</p></div>
									<div><strong>Trade School Course of Study</strong><p>{displayValue(application.trade_school_course_of_study)}</p></div>
									<div><strong>Trade School Years Completed</strong><p>{displayValue(application.trade_school_years_completed)}</p></div>
									<div><strong>Trade School Diploma / Degree</strong><p>{displayValue(application.trade_school_diploma_or_degree)}</p></div>
									<div><strong>Graduate Work Name</strong><p>{displayValue(application.graduate_work_name)}</p></div>
									<div><strong>Graduate Work Course of Study</strong><p>{displayValue(application.graduate_work_course_of_study)}</p></div>
									<div><strong>Graduate Work Years Completed</strong><p>{displayValue(application.graduate_work_years_completed)}</p></div>
									<div><strong>Graduate Work Diploma / Degree</strong><p>{displayValue(application.graduate_work_diploma_or_degree)}</p></div>
								</div>
							</div>

							<div className='admin-card'>
								<h2>Employment History</h2>
								<div className='employment-detail-grid'>
									<div><strong>Employer 1 Name</strong><p>{displayValue(application.employer_1_name)}</p></div>
									<div><strong>Employer 1 Phone</strong><p>{displayValue(application.employer_1_phone)}</p></div>
									<div><strong>Employer 1 Address</strong><p>{displayValue(application.employer_1_address)}</p></div>
									<div><strong>Employer 1 Supervisor</strong><p>{displayValue(application.employer_1_supervisor)}</p></div>
									<div><strong>Employer 1 Dates</strong><p>{displayValue(application.employer_1_dates)}</p></div>
									<div><strong>Employer 1 Reason for Leaving</strong><p>{displayValue(application.employer_1_reason_for_leaving)}</p></div>
									<div><strong>Employer 1 Work Performed</strong><p>{displayValue(application.employer_1_work_performed)}</p></div>
									<div><strong>Employer 2 Name</strong><p>{displayValue(application.employer_2_name)}</p></div>
									<div><strong>Employer 2 Phone</strong><p>{displayValue(application.employer_2_phone)}</p></div>
									<div><strong>Employer 2 Address</strong><p>{displayValue(application.employer_2_address)}</p></div>
									<div><strong>Employer 2 Supervisor</strong><p>{displayValue(application.employer_2_supervisor)}</p></div>
									<div><strong>Employer 2 Dates</strong><p>{displayValue(application.employer_2_dates)}</p></div>
									<div><strong>Employer 2 Reason for Leaving</strong><p>{displayValue(application.employer_2_reason_for_leaving)}</p></div>
									<div><strong>Employer 2 Work Performed</strong><p>{displayValue(application.employer_2_work_performed)}</p></div>
								</div>
							</div>

							<div className='admin-card'>
								<h2>References and Final Details</h2>
								<div className='employment-detail-grid'>
									<div><strong>Reference 1 Name</strong><p>{displayValue(application.reference_1_name)}</p></div>
									<div><strong>Reference 1 Address</strong><p>{displayValue(application.reference_1_address)}</p></div>
									<div><strong>Reference 1 Phone</strong><p>{displayValue(application.reference_1_phone)}</p></div>
									<div><strong>Reference 2 Name</strong><p>{displayValue(application.reference_2_name)}</p></div>
									<div><strong>Reference 2 Address</strong><p>{displayValue(application.reference_2_address)}</p></div>
									<div><strong>Reference 2 Phone</strong><p>{displayValue(application.reference_2_phone)}</p></div>
									<div><strong>Previous Experience</strong><p>{displayValue(application.previous_experience)}</p></div>
									<div><strong>Why Work Here</strong><p>{displayValue(application.why_work_here)}</p></div>
									<div><strong>Applicant Signature</strong><p>{displayValue(application.applicant_signature)}</p></div>
									<div><strong>Signature Date</strong><p>{displayValue(application.applicant_signature_date)}</p></div>
									<div><strong>Acknowledgement</strong><p>{displayBoolean(application.applicant_acknowledgement)}</p></div>
								</div>
							</div>
						</div>
					</div>

					<div className='print-only'>
						<EmploymentApplicationPrintTemplate application={application} />
					</div>
				</>
			)}
		</section>
	)
}