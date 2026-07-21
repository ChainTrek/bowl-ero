import { useEffect, useMemo, useState } from 'react'
import PublicPageShell from '../components/layout/PublicPageShell'
import PublicContentSection from '../components/layout/PublicContentSection'
import {
	getPublicReservationBlockouts,
	createReservationRequest,
} from '../services/supabase/publicReservations'
import { getReservationAvailability } from '../utils/reservations/availability'

const initialForm = {
	customer_name: '',
	phone: '',
	email: '',
	event_date: '',
	start_time: '',
	end_time: '',
	guest_count: '',
	package_type: '',
	extra_lanes: 0,
	extra_pizzas: 0,
	extra_pitchers: 0,
	event_type: '',
	notes: '',
}

function toNumberOrZero(value) {
	if (value === '' || value === null || value === undefined) return 0
	const parsed = Number(value)
	return Number.isNaN(parsed) ? 0 : parsed
}

export default function ReservationsPage() {
	const [formData, setFormData] = useState(initialForm)
	const [blockouts, setBlockouts] = useState([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	useEffect(() => {
		async function loadBlockouts() {
			try {
				setLoading(true)
				setErrorMessage('')

				const data = await getPublicReservationBlockouts()
				setBlockouts(data)
			} catch (error) {
				setErrorMessage(`Unable to load reservation availability: ${error.message}`)
			} finally {
				setLoading(false)
			}
		}

		loadBlockouts()
	}, [])

	const availability = useMemo(() => {
		return getReservationAvailability({
			blockouts,
			targetDate: formData.event_date,
			startTime: formData.start_time,
			endTime: formData.end_time,
		})
	}, [blockouts, formData.event_date, formData.start_time, formData.end_time])

	const laneRecommendation = useMemo(() => {
		const guestCount = formData.guest_count === '' ? 0 : Number(formData.guest_count)
		const extraLanes = toNumberOrZero(formData.extra_lanes)
		const recommendedLanes = guestCount > 0 ? Math.ceil(guestCount / 5) : 0

		if (recommendedLanes === 0) return ''

		return `Recommended lane count for ${guestCount} guest${
			guestCount === 1 ? '' : 's'
		}: about ${recommendedLanes} lane${
			recommendedLanes === 1 ? '' : 's'
		} total, based on no more than 5 people per lane. Extra lanes requested: ${extraLanes}.`
	}, [formData.guest_count, formData.extra_lanes])

	const pizzaRecommendation = useMemo(() => {
		const guestCount = formData.guest_count === '' ? 0 : Number(formData.guest_count)
		const extraPizzas = toNumberOrZero(formData.extra_pizzas)
		const recommendedPizzas = guestCount > 0 ? Math.ceil(guestCount / 5) : 0

		if (recommendedPizzas === 0) return ''

		return `For ${guestCount} guest${guestCount === 1 ? '' : 's'}, about ${recommendedPizzas} pizza${
			recommendedPizzas === 1 ? '' : 's'
		} can help cover the group, based on 5 people per pizza. Extra pizzas requested: ${extraPizzas}.`
	}, [formData.guest_count, formData.extra_pizzas])

	function clearMessages() {
		setErrorMessage('')
		setSuccessMessage('')
	}

	function handleChange(event) {
		const { name, value } = event.target

		setFormData(prev => ({
			...prev,
			[name]: value,
		}))

		if (errorMessage || successMessage) {
			clearMessages()
		}
	}

	function validateForm() {
		if (!formData.customer_name.trim()) {
			return 'Your name is required.'
		}

		if (!formData.phone.trim()) {
			return 'Phone number is required.'
		}

		if (!formData.email.trim()) {
			return 'Email address is required.'
		}

		if (!formData.event_date) {
			return 'Event date is required.'
		}

		if (!formData.start_time) {
			return 'Start time is required.'
		}

		if (!formData.end_time) {
			return 'End time is required.'
		}

		if (!formData.package_type) {
			return 'Please choose Package 1 or Package 2.'
		}

		if (toNumberOrZero(formData.extra_lanes) < 0) {
			return 'Extra lanes cannot be negative.'
		}

		if (toNumberOrZero(formData.extra_pizzas) < 0) {
			return 'Extra pizzas cannot be negative.'
		}

		if (toNumberOrZero(formData.extra_pitchers) < 0) {
			return 'Extra pitchers cannot be negative.'
		}

		if (!availability.isAvailable) {
			return availability.reason || 'That time slot is not available.'
		}

		return ''
	}

	async function handleSubmit(event) {
		event.preventDefault()

		const validationMessage = validateForm()

		if (validationMessage) {
			setErrorMessage(validationMessage)
			setSuccessMessage('')
			return
		}

		try {
			setSubmitting(true)
			clearMessages()

			await createReservationRequest({
				customer_name: formData.customer_name.trim(),
				phone: formData.phone.trim(),
				email: formData.email.trim(),
				event_date: formData.event_date,
				start_time: formData.start_time,
				end_time: formData.end_time,
				guest_count: formData.guest_count === '' ? null : Number(formData.guest_count),
				package_type: formData.package_type,
				extra_lanes: toNumberOrZero(formData.extra_lanes),
				extra_pizzas: toNumberOrZero(formData.extra_pizzas),
				extra_pitchers: toNumberOrZero(formData.extra_pitchers),
				event_type: formData.event_type.trim() || null,
				notes: formData.notes.trim() || null,
				status: 'pending',
			})

			setFormData(initialForm)
			setSuccessMessage(
				'Your reservation request has been submitted. This request is not automatically confirmed. Our team will review it and contact you soon.'
			)
		} catch (error) {
			setErrorMessage(`Unable to submit reservation request: ${error.message}`)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<PublicPageShell
			eyebrow='Reservations'
			title='Party Reservation Request'
			description='Choose a date and time, select a package, and submit a reservation request for Bowl-Ero.'
			mainClassName='reservations-page'
		>
			<PublicContentSection>
				<div className='reservations-page__layout'>
					<div className='reservations-page__info public-card'>
						<span className='public-eyebrow'>How It Works</span>
						<h2>Request a party reservation</h2>
						<p>
							Submit your preferred date and time below. Requests are reviewed by our team
							before they are confirmed.
						</p>

						<div className='reservations-page__info-list'>
							<div className='reservations-page__info-item'>
								<h3>Packages</h3>
								<p>Choose either Package 1 or Package 2 as the base for your request.</p>
							</div>

							<div className='reservations-page__info-item'>
								<h3>Add-ons</h3>
								<p>
									You can request extra lanes, pizzas, and pitchers of soda. We recommend
									no more than 5 people per lane, and each pizza accommodates about 5
									people.
								</p>
							</div>

							<div className='reservations-page__info-item'>
								<h3>Important</h3>
								<p>
									Submitting this form does not automatically confirm your reservation.
								</p>
							</div>
						</div>
					</div>

					<div className='reservations-page__form-wrapper public-card'>
						{loading ? (
							<p className='public-loading'>Loading availability...</p>
						) : (
							<form className='public-form reservations-form' onSubmit={handleSubmit}>
								<div className='form-group'>
									<label htmlFor='customer_name'>Full Name</label>
									<input
										id='customer_name'
										name='customer_name'
										type='text'
										value={formData.customer_name}
										onChange={handleChange}
									/>
								</div>

								<div className='form-row'>
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
								</div>

								<div className='form-row'>
									<div className='form-group'>
										<label htmlFor='event_date'>Event Date</label>
										<input
											id='event_date'
											name='event_date'
											type='date'
											value={formData.event_date}
											onChange={handleChange}
										/>
									</div>

									<div className='form-group'>
										<label htmlFor='guest_count'>Guest Count</label>
										<input
											id='guest_count'
											name='guest_count'
											type='number'
											min='0'
											value={formData.guest_count}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className='form-row'>
									<div className='form-group'>
										<label htmlFor='start_time'>Start Time</label>
										<input
											id='start_time'
											name='start_time'
											type='time'
											value={formData.start_time}
											onChange={handleChange}
										/>
									</div>

									<div className='form-group'>
										<label htmlFor='end_time'>End Time</label>
										<input
											id='end_time'
											name='end_time'
											type='time'
											value={formData.end_time}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className='form-group'>
									<label htmlFor='package_type'>Package</label>
									<select
										id='package_type'
										name='package_type'
										value={formData.package_type}
										onChange={handleChange}
									>
										<option value=''>Select a package</option>
										<option value='Package 1'>Package 1</option>
										<option value='Package 2'>Package 2</option>
									</select>
								</div>

								<div className='reservations-form__addons'>
									<div className='reservations-form__addons-header'>
										<h3>Add-ons</h3>
										<p>Request extra options for your party if needed.</p>
									</div>

									<div className='reservations-form__addons-grid'>
										<div className='form-group'>
											<label htmlFor='extra_lanes'>Extra Lanes</label>
											<input
												id='extra_lanes'
												name='extra_lanes'
												type='number'
												min='0'
												value={formData.extra_lanes}
												onChange={handleChange}
											/>
											<small>No more than 5 people per lane is recommended.</small>
										</div>

										<div className='form-group'>
											<label htmlFor='extra_pizzas'>Extra Pizzas</label>
											<input
												id='extra_pizzas'
												name='extra_pizzas'
												type='number'
												min='0'
												value={formData.extra_pizzas}
												onChange={handleChange}
											/>
											<small>Each pizza accommodates about 5 people.</small>
										</div>
									</div>

									<div className='form-group'>
										<label htmlFor='extra_pitchers'>Extra Pitchers of Soda</label>
										<input
											id='extra_pitchers'
											name='extra_pitchers'
											type='number'
											min='0'
											value={formData.extra_pitchers}
											onChange={handleChange}
										/>
									</div>

									{laneRecommendation && (
										<p className='reservations-form__helper'>{laneRecommendation}</p>
									)}

									{pizzaRecommendation && (
										<p className='reservations-form__helper'>{pizzaRecommendation}</p>
									)}
								</div>

								<div className='form-group'>
									<label htmlFor='event_type'>Event Type</label>
									<input
										id='event_type'
										name='event_type'
										type='text'
										value={formData.event_type}
										onChange={handleChange}
										placeholder='Birthday, team party, group event, etc.'
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='notes'>Notes</label>
									<textarea
										id='notes'
										name='notes'
										rows='5'
										value={formData.notes}
										onChange={handleChange}
										placeholder='Tell us anything helpful about your event.'
									/>
								</div>

								<div
									className={`reservations-form__availability ${
										availability.isAvailable
											? 'reservations-form__availability--available'
											: 'reservations-form__availability--blocked'
									}`}
								>
									<h3>{availability.isAvailable ? 'Time Slot Looks Open' : 'Time Slot Unavailable'}</h3>
									<p>
										{availability.isAvailable
											? 'This requested time does not conflict with any active blockouts.'
											: availability.reason || 'This time cannot be requested right now.'}
									</p>
								</div>

								{successMessage && <p className='public-form__success'>{successMessage}</p>}
								{errorMessage && <p className='public-form__error'>{errorMessage}</p>}

								<button
									type='submit'
									disabled={submitting || loading || !availability.isAvailable}
								>
									{submitting ? 'Submitting...' : 'Submit Reservation Request'}
								</button>
							</form>
						)}
					</div>
				</div>
			</PublicContentSection>
		</PublicPageShell>
	)
}