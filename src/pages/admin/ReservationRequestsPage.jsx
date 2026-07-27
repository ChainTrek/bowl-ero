import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
	getReservationRequests,
	updateReservationRequest,
} from '../../services/supabase/adminReservations'
import {
	formatReservationDate,
	formatReservationTimeRange,
} from '../../utils/reservations/formatters'
import { formatDateTime } from '../../utils/formatDateTime'

const STATUS_OPTIONS = [
	'pending',
	'approved',
	'declined',
	'cancelled',
]

function sortRequests(items) {
	return [...items].sort((a, b) => {
		const createdCompare = String(
			b.created_at || '',
		).localeCompare(String(a.created_at || ''))

		if (createdCompare !== 0) {
			return createdCompare
		}

		return String(b.event_date || '').localeCompare(
			String(a.event_date || ''),
		)
	})
}

function buildAddOnSummary(request) {
	const parts = []

	if ((request.extra_lanes ?? 0) > 0) {
		parts.push(
			`${request.extra_lanes} extra lane${
				request.extra_lanes === 1 ? '' : 's'
			}`,
		)
	}

	if ((request.extra_pizzas ?? 0) > 0) {
		parts.push(
			`${request.extra_pizzas} extra pizza${
				request.extra_pizzas === 1 ? '' : 's'
			}`,
		)
	}

	if ((request.extra_pitchers ?? 0) > 0) {
		parts.push(
			`${request.extra_pitchers} extra pitcher${
				request.extra_pitchers === 1 ? '' : 's'
			} of soda`,
		)
	}

	return parts.length > 0
		? parts.join(' • ')
		: 'No add-ons requested'
}

function hasAddOns(request) {
	return (
		(request.extra_lanes ?? 0) > 0 ||
		(request.extra_pizzas ?? 0) > 0 ||
		(request.extra_pitchers ?? 0) > 0
	)
}

function getStatusBadgeClass(status) {
	switch (status) {
		case 'approved':
			return 'reservation-request-item__badge reservation-request-item__badge--status-approved'

		case 'declined':
			return 'reservation-request-item__badge reservation-request-item__badge--status-declined'

		case 'cancelled':
			return 'reservation-request-item__badge reservation-request-item__badge--status-cancelled'

		case 'pending':
		default:
			return 'reservation-request-item__badge reservation-request-item__badge--status-pending'
	}
}

function formatStatusLabel(status) {
	if (!status) {
		return 'Pending'
	}

	return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function ReservationRequestsPage() {
	const [requests, setRequests] = useState([])
	const [selectedRequestId, setSelectedRequestId] =
		useState(null)
	const [statusFilter, setStatusFilter] = useState('')
	const [reviewForm, setReviewForm] = useState({
		status: 'pending',
		admin_notes: '',
	})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const { refreshCounts } = useOutletContext()

	const selectedRequest = useMemo(
		() =>
			requests.find(
				request => request.id === selectedRequestId,
			) || null,
		[requests, selectedRequestId],
	)

	useEffect(() => {
		let isMounted = true

		async function loadRequests() {
			try {
				const data =
					await getReservationRequests(statusFilter)

				const sortedRequests = sortRequests(data)

				if (!isMounted) {
					return
				}

				setRequests(sortedRequests)

				const firstRequest = sortedRequests[0] || null

				setSelectedRequestId(firstRequest?.id ?? null)

				setReviewForm({
					status: firstRequest?.status || 'pending',
					admin_notes:
						firstRequest?.admin_notes || '',
				})
			} catch (error) {
				if (isMounted) {
					setErrorMessage(
						`Error loading reservation requests: ${error.message}`,
					)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadRequests()

		return () => {
			isMounted = false
		}
	}, [statusFilter])

	function clearMessages() {
		setErrorMessage('')
		setSuccessMessage('')
	}

	function handleFilterChange(event) {
		setLoading(true)
		setStatusFilter(event.target.value)
		setSelectedRequestId(null)

		setReviewForm({
			status: 'pending',
			admin_notes: '',
		})

		clearMessages()
	}

	function handleSelectRequest(request) {
		setSelectedRequestId(request.id)

		setReviewForm({
			status: request.status || 'pending',
			admin_notes: request.admin_notes || '',
		})

		clearMessages()
	}

	function handleReviewChange(event) {
		const { name, value } = event.target

		setReviewForm(previousReviewForm => ({
			...previousReviewForm,
			[name]: value,
		}))
	}

	async function handleSaveReview(event) {
		event.preventDefault()

		if (!selectedRequest) {
			return
		}

		try {
			setSaving(true)
			clearMessages()

			const updatedRequest =
				await updateReservationRequest(
					selectedRequest.id,
					{
						status: reviewForm.status,
						admin_notes:
							reviewForm.admin_notes.trim() ||
							null,
					},
				)

			setRequests(previousRequests =>
				sortRequests(
					previousRequests.map(request =>
						request.id === selectedRequest.id
							? updatedRequest
							: request,
					),
				),
			)

			setReviewForm({
				status: updatedRequest.status || 'pending',
				admin_notes:
					updatedRequest.admin_notes || '',
			})

			await refreshCounts()

			setSuccessMessage(
				'Reservation request updated successfully.',
			)
		} catch (error) {
			setErrorMessage(
				`Error updating reservation request: ${error.message}`,
			)
		} finally {
			setSaving(false)
		}
	}

	return (
		<section className='admin-page reservation-requests-page'>
			<div className='admin-page__header'>
				<h1>Reservation Requests</h1>

				<p>
					Review customer reservation requests and update
					their status.
				</p>
			</div>

			<div className='admin-card'>
				<div className='reservation-requests-page__filter-row'>
					<div>
						<h2>Incoming Requests</h2>

						<p>
							Filter by status and select a request to
							review.
						</p>
					</div>

					<div className='form-group reservation-requests-page__filter'>
						<label htmlFor='reservation-status-filter'>
							Status Filter
						</label>

						<select
							id='reservation-status-filter'
							value={statusFilter}
							onChange={handleFilterChange}
							disabled={loading || saving}
						>
							<option value=''>All</option>

							{STATUS_OPTIONS.map(status => (
								<option key={status} value={status}>
									{formatStatusLabel(status)}
								</option>
							))}
						</select>
					</div>
				</div>

				{successMessage && (
					<p className='status-message status-message--success'>
						{successMessage}
					</p>
				)}

				{errorMessage && (
					<p className='status-message status-message--error'>
						{errorMessage}
					</p>
				)}

				{loading ? (
					<p>Loading reservation requests...</p>
				) : requests.length === 0 ? (
					<p>No reservation requests found.</p>
				) : (
					<div className='reservation-request-list'>
						{requests.map(request => (
							<article
								key={request.id}
								className={`reservation-request-item ${
									selectedRequestId === request.id
										? 'reservation-request-item--selected'
										: ''
								}`}
							>
								<div className='reservation-request-item__info'>
									<h3>{request.customer_name}</h3>

									<div className='reservation-request-item__badges'>
										<span
											className={getStatusBadgeClass(
												request.status,
											)}
										>
											{formatStatusLabel(
												request.status,
											)}
										</span>

										{request.package_type && (
											<span className='reservation-request-item__badge reservation-request-item__badge--package'>
												{request.package_type}
											</span>
										)}

										<span
											className={`reservation-request-item__badge ${
												hasAddOns(request)
													? 'reservation-request-item__badge--addons'
													: 'reservation-request-item__badge--plain'
											}`}
										>
											{hasAddOns(request)
												? 'Add-ons Requested'
												: 'No Add-ons'}
										</span>
									</div>

									<p>
										<strong>Date:</strong>{' '}
										{formatReservationDate(
											request.event_date,
										)}
									</p>

									<p>
										<strong>Time:</strong>{' '}
										{formatReservationTimeRange(
											request.start_time,
											request.end_time,
										)}
									</p>

									<p>
										<strong>Status:</strong>{' '}
										{formatStatusLabel(
											request.status,
										)}
									</p>

									<p>
										<strong>Package:</strong>{' '}
										{request.package_type ||
											'Not selected'}
									</p>

									<p>
										<strong>Add-ons:</strong>{' '}
										{buildAddOnSummary(request)}
									</p>

									{request.event_type && (
										<p>
											<strong>Type:</strong>{' '}
											{request.event_type}
										</p>
									)}
								</div>

								<div className='reservation-request-item__actions'>
									<button
										type='button'
										className='secondary-button'
										onClick={() =>
											handleSelectRequest(
												request,
											)
										}
										disabled={saving}
									>
										{selectedRequestId ===
										request.id
											? 'Selected'
											: 'Review'}
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</div>

			<div className='admin-card'>
				<h2>Request Review</h2>

				{!selectedRequest ? (
					<p>
						Select a reservation request to review its
						details.
					</p>
				) : (
					<div className='reservation-request-review'>
						<div className='reservation-request-review__details'>
							<h3>{selectedRequest.customer_name}</h3>

							<div className='reservation-request-review__detail-grid'>
								<p>
									<strong>Phone:</strong>{' '}
									{selectedRequest.phone ||
										'Not provided'}
								</p>

								<p>
									<strong>Email:</strong>{' '}
									{selectedRequest.email ||
										'Not provided'}
								</p>

								<p>
									<strong>Event Date:</strong>{' '}
									{formatReservationDate(
										selectedRequest.event_date,
									)}
								</p>

								<p>
									<strong>Event Time:</strong>{' '}
									{formatReservationTimeRange(
										selectedRequest.start_time,
										selectedRequest.end_time,
									)}
								</p>

								<p>
									<strong>Guest Count:</strong>{' '}
									{selectedRequest.guest_count ??
										'Not provided'}
								</p>

								<p>
									<strong>Package:</strong>{' '}
									{selectedRequest.package_type ||
										'Not provided'}
								</p>

								<p>
									<strong>Extra Lanes:</strong>{' '}
									{selectedRequest.extra_lanes ?? 0}
								</p>

								<p>
									<strong>Extra Pizzas:</strong>{' '}
									{selectedRequest.extra_pizzas ??
										0}
								</p>

								<p>
									<strong>Extra Pitchers:</strong>{' '}
									{selectedRequest.extra_pitchers ??
										0}
								</p>

								<p>
									<strong>Event Type:</strong>{' '}
									{selectedRequest.event_type ||
										'Not provided'}
								</p>

								<p>
									<strong>Submitted:</strong>{' '}
									{formatDateTime(
										selectedRequest.created_at,
									)}
								</p>

								<p>
									<strong>Current Status:</strong>{' '}
									{formatStatusLabel(
										selectedRequest.status,
									)}
								</p>
							</div>

							<div className='reservation-request-review__notes'>
								<h4>Customer Notes</h4>

								<p>
									{selectedRequest.notes ||
										'No customer notes were provided.'}
								</p>
							</div>
						</div>

						<form
							className='reservation-request-review__form'
							onSubmit={handleSaveReview}
						>
							<div className='form-group'>
								<label htmlFor='review-status'>
									Status
								</label>

								<select
									id='review-status'
									name='status'
									value={reviewForm.status}
									onChange={handleReviewChange}
									disabled={saving}
								>
									{STATUS_OPTIONS.map(status => (
										<option
											key={status}
											value={status}
										>
											{formatStatusLabel(
												status,
											)}
										</option>
									))}
								</select>
							</div>

							<div className='form-group'>
								<label htmlFor='admin_notes'>
									Admin Notes
								</label>

								<textarea
									id='admin_notes'
									name='admin_notes'
									rows='6'
									value={reviewForm.admin_notes}
									onChange={handleReviewChange}
									placeholder='Internal notes about this request'
									disabled={saving}
								/>
							</div>

							<div className='form-actions'>
								<button
									type='submit'
									disabled={saving}
								>
									{saving
										? 'Saving...'
										: 'Save Review'}
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</section>
	)
}