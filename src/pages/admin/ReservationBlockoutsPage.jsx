import { useEffect, useMemo, useState } from 'react'
import {
	getReservationBlockouts,
	createReservationBlockout,
	updateReservationBlockout,
	deleteReservationBlockout,
} from '../../services/supabase/reservations'
import ReservationAvailabilityPreview from '../../components/admin/ReservationAvailabilityPreview'

const initialForm = {
	title: '',
	description: '',
	block_date: '',
	start_time: '',
	end_time: '',
	reason: '',
	is_active: true,
}

function sortBlockouts(items) {
	return [...items].sort((a, b) => {
		const dateCompare = String(a.block_date || '').localeCompare(String(b.block_date || ''))
		if (dateCompare !== 0) return dateCompare

		const startCompare = String(a.start_time || '').localeCompare(String(b.start_time || ''))
		if (startCompare !== 0) return startCompare

		return String(a.created_at || '').localeCompare(String(b.created_at || ''))
	})
}

function formatDate(value) {
	if (!value) return 'No date set'

	const [year, month, day] = value.split('-')
	if (!year || !month || !day) return value

	return `${month}/${day}/${year}`
}

function formatTime(value) {
	if (!value) return ''

	const [hours, minutes] = value.split(':')
	if (hours === undefined || minutes === undefined) return value

	const hourNumber = Number(hours)
	const suffix = hourNumber >= 12 ? 'PM' : 'AM'
	const normalizedHour = hourNumber % 12 || 12

	return `${normalizedHour}:${minutes} ${suffix}`
}

export default function ReservationBlockoutsPage() {
	const [blockouts, setBlockouts] = useState([])
	const [formData, setFormData] = useState(initialForm)
	const [editingBlockoutId, setEditingBlockoutId] = useState(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const isEditing = useMemo(() => Boolean(editingBlockoutId), [editingBlockoutId])

	useEffect(() => {
		loadBlockouts()
	}, [])

	async function loadBlockouts() {
		try {
			setLoading(true)
			setErrorMessage('')

			const data = await getReservationBlockouts()
			setBlockouts(sortBlockouts(data))
		} catch (error) {
			setErrorMessage(`Error loading reservation blockouts: ${error.message}`)
		} finally {
			setLoading(false)
		}
	}

	function resetForm() {
		setFormData(initialForm)
		setEditingBlockoutId(null)
		setErrorMessage('')
	}

	function clearMessages() {
		setErrorMessage('')
		setSuccessMessage('')
	}

	function handleChange(event) {
		const { name, value, type, checked } = event.target

		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	function handleEditClick(blockout) {
		setEditingBlockoutId(blockout.id)
		setFormData({
			title: blockout.title || '',
			description: blockout.description || '',
			block_date: blockout.block_date || '',
			start_time: blockout.start_time || '',
			end_time: blockout.end_time || '',
			reason: blockout.reason || '',
			is_active: blockout.is_active ?? true,
		})
		clearMessages()
	}

	function handleCancelEdit() {
		resetForm()
		setSuccessMessage('')
	}

	function validateForm() {
		if (!formData.title.trim()) {
			return 'Blockout title is required.'
		}

		if (!formData.block_date) {
			return 'Block date is required.'
		}

		if (!formData.start_time) {
			return 'Start time is required.'
		}

		if (!formData.end_time) {
			return 'End time is required.'
		}

		if (formData.end_time <= formData.start_time) {
			return 'End time must be later than start time.'
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
			setSaving(true)
			clearMessages()

			const payload = {
				title: formData.title.trim(),
				description: formData.description.trim() || null,
				block_date: formData.block_date,
				start_time: formData.start_time,
				end_time: formData.end_time,
				reason: formData.reason.trim() || null,
				is_active: formData.is_active,
			}

			if (editingBlockoutId) {
				const updatedBlockout = await updateReservationBlockout(editingBlockoutId, payload)

				setBlockouts(prev =>
					sortBlockouts(prev.map(item => (item.id === editingBlockoutId ? updatedBlockout : item))),
				)

				setSuccessMessage('Reservation blockout updated successfully.')
			} else {
				const newBlockout = await createReservationBlockout(payload)

				setBlockouts(prev => sortBlockouts([...prev, newBlockout]))
				setSuccessMessage('Reservation blockout added successfully.')
			}

			resetForm()
		} catch (error) {
			setErrorMessage(
				`Error ${editingBlockoutId ? 'updating' : 'creating'} reservation blockout: ${error.message}`,
			)
			setSuccessMessage('')
		} finally {
			setSaving(false)
		}
	}

	async function handleDelete(blockout) {
		const confirmed = window.confirm(
			`Delete "${blockout.title}" on ${formatDate(blockout.block_date)}?\n\nThis cannot be undone.`,
		)

		if (!confirmed) return

		try {
			clearMessages()

			await deleteReservationBlockout(blockout.id)
			setBlockouts(prev => prev.filter(item => item.id !== blockout.id))

			if (editingBlockoutId === blockout.id) {
				resetForm()
			}

			setSuccessMessage('Reservation blockout deleted successfully.')
		} catch (error) {
			setErrorMessage(`Error deleting reservation blockout: ${error.message}`)
			setSuccessMessage('')
		}
	}

	return (
		<section className='admin-page reservation-blockouts-page'>
			<div className='admin-page__header'>
				<h1>Reservation Blockouts</h1>
				<p>Block dates and time ranges for tournaments, maintenance, rentals, and special events.</p>
			</div>

			<div className='admin-card'>
				<h2>{isEditing ? 'Edit Blockout' : 'Add Blockout'}</h2>

				<form className='reservation-blockout-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='title'>Title</label>
						<input
							id='title'
							name='title'
							type='text'
							value={formData.title}
							onChange={handleChange}
							placeholder='Example: Youth Tournament'
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='reason'>Reason</label>
						<input
							id='reason'
							name='reason'
							type='text'
							value={formData.reason}
							onChange={handleChange}
							placeholder='Example: Tournament, Maintenance, Private Event'
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='description'>Description</label>
						<textarea
							id='description'
							name='description'
							rows='4'
							value={formData.description}
							onChange={handleChange}
							placeholder='Optional notes for admin reference'
						/>
					</div>

					<div className='form-row'>
						<div className='form-group'>
							<label htmlFor='block_date'>Block Date</label>
							<input
								id='block_date'
								name='block_date'
								type='date'
								value={formData.block_date}
								onChange={handleChange}
							/>
						</div>

						<div className='form-checkbox reservation-blockout-form__checkbox'>
							<label htmlFor='is_active'>
								<input
									id='is_active'
									name='is_active'
									type='checkbox'
									checked={formData.is_active}
									onChange={handleChange}
								/>
								Active
							</label>
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

					<div className='form-actions'>
						<button type='submit' disabled={saving}>
							{saving ? 'Saving...' : isEditing ? 'Update Blockout' : 'Add Blockout'}
						</button>

						{isEditing && (
							<button type='button' className='secondary-button' onClick={handleCancelEdit}>
								Cancel Edit
							</button>
						)}
					</div>

					{successMessage && <p className='status-message status-message--success'>{successMessage}</p>}
					{errorMessage && <p className='status-message status-message--error'>{errorMessage}</p>}
				</form>
			</div>

			<div className='admin-card'>
				<h2>Current Blockouts</h2>

				{loading ? (
					<p>Loading reservation blockouts...</p>
				) : blockouts.length === 0 ? (
					<p>No blockouts found yet.</p>
				) : (
					<div className='reservation-blockout-list'>
						{blockouts.map(blockout => (
							<article
								className={`reservation-blockout-item ${
									!blockout.is_active ? 'reservation-blockout-item--inactive' : ''
								}`}
								key={blockout.id}
							>
								<div className='reservation-blockout-item__info'>
									<h3>{blockout.title}</h3>
									<p>
										<strong>Date:</strong> {formatDate(blockout.block_date)}
									</p>
									<p>
										<strong>Time:</strong> {formatTime(blockout.start_time)} -{' '}
										{formatTime(blockout.end_time)}
									</p>
									<p>
										<strong>Status:</strong> {blockout.is_active ? 'Active' : 'Inactive'}
									</p>
									{blockout.reason && (
										<p>
											<strong>Reason:</strong> {blockout.reason}
										</p>
									)}
									{blockout.description && <p>{blockout.description}</p>}
								</div>

								<div className='reservation-blockout-item__actions'>
									<button
										type='button'
										className='edit-button'
										onClick={() => handleEditClick(blockout)}
									>
										Edit
									</button>

									<button
										type='button'
										className='danger-button'
										onClick={() => handleDelete(blockout)}
									>
										Delete
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
			<ReservationAvailabilityPreview blockouts={blockouts} />
		</section>
	)
}