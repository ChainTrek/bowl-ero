import { useMemo, useState } from 'react'
import { getReservationAvailability } from '../../utils/reservations/availability'

export default function ReservationAvailabilityPreview({ blockouts = [] }) {
	const [formData, setFormData] = useState({
		targetDate: '',
		startTime: '',
		endTime: '',
	})

	const availability = useMemo(() => {
		return getReservationAvailability({
			blockouts,
			targetDate: formData.targetDate,
			startTime: formData.startTime,
			endTime: formData.endTime,
		})
	}, [blockouts, formData])

	function handleChange(event) {
		const { name, value } = event.target

		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<div className='admin-card reservation-availability-preview'>
			<h2>Availability Preview</h2>
			<p>Test whether a reservation slot would be blocked by current blockouts.</p>

			<div className='reservation-availability-preview__form'>
				<div className='form-group'>
					<label htmlFor='targetDate'>Date</label>
					<input
						id='targetDate'
						name='targetDate'
						type='date'
						value={formData.targetDate}
						onChange={handleChange}
					/>
				</div>

				<div className='form-row'>
					<div className='form-group'>
						<label htmlFor='startTime'>Start Time</label>
						<input
							id='startTime'
							name='startTime'
							type='time'
							value={formData.startTime}
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='endTime'>End Time</label>
						<input
							id='endTime'
							name='endTime'
							type='time'
							value={formData.endTime}
							onChange={handleChange}
						/>
					</div>
				</div>
			</div>

			<div
				className={`reservation-availability-preview__result ${
					availability.isAvailable
						? 'reservation-availability-preview__result--available'
						: 'reservation-availability-preview__result--blocked'
				}`}
			>
				<h3>{availability.isAvailable ? 'Available' : 'Unavailable'}</h3>

				<p>
					{availability.isAvailable
						? 'This time slot is currently open based on active blockouts.'
						: availability.reason}
				</p>

				{availability.blockingBlockout && (
					<div className='reservation-availability-preview__details'>
						<p>
							<strong>Blockout:</strong> {availability.blockingBlockout.title}
						</p>
						{availability.blockingBlockout.reason && (
							<p>
								<strong>Reason:</strong> {availability.blockingBlockout.reason}
							</p>
						)}
						{availability.blockingBlockout.description && (
							<p>
								<strong>Description:</strong>{' '}
								{availability.blockingBlockout.description}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}