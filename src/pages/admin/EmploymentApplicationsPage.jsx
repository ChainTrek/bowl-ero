import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEmploymentApplications } from '../../services/supabase/employmentApplications'
import { formatDateTime } from '../../utils/formatDateTime'

function getApplicationSubmittedBadgeClass() {
	return 'employment-application-badge employment-application-badge--new'
}

function getPositionBadgeClass() {
	return 'employment-application-badge employment-application-badge--position'
}

function getEmploymentTypeBadgeClass() {
	return 'employment-application-badge employment-application-badge--type'
}

export default function EmploymentApplicationsPage() {
	const [applications, setApplications] = useState([])
	const [loading, setLoading] = useState(true)
	const [statusMessage, setStatusMessage] = useState('')

	useEffect(() => {
		loadApplications()
	}, [])

	async function loadApplications() {
		try {
			setLoading(true)
			const data = await getEmploymentApplications()
			setApplications(data)
		} catch (error) {
			setStatusMessage(`Error loading applications: ${error.message}`)
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className='admin-page employment-applications-page'>
			<div className='admin-page__header'>
				<h1>Employment Applications</h1>
				<p>Review submitted job applications from the public site.</p>
			</div>

			<div className='admin-card'>
				<h2>Submitted Applications</h2>

				{statusMessage && <p className='status-message'>{statusMessage}</p>}

				{loading ? (
					<p>Loading applications...</p>
				) : applications.length === 0 ? (
					<p>No applications have been submitted yet.</p>
				) : (
					<div className='employment-application-list'>
						{applications.map(application => (
							<article className='employment-application-item' key={application.id}>
								<div className='employment-application-item__header'>
									<div>
										<h3>
											{application.first_name} {application.last_name}
										</h3>

										<div className='employment-application-item__badges'>
											<span className={getApplicationSubmittedBadgeClass()}>
												Application Received
											</span>

											{application.position_desired && (
												<span className={getPositionBadgeClass()}>
													{application.position_desired}
												</span>
											)}

											{application.employment_type && (
												<span className={getEmploymentTypeBadgeClass()}>
													{application.employment_type}
												</span>
											)}
										</div>

										<p>Submitted: {formatDateTime(application.created_at)}</p>
									</div>

									<div className='employment-application-item__actions'>
										<Link
											to={`/admin/applications/${application.id}`}
											className='edit-button'
										>
											View Details
										</Link>
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	)
}