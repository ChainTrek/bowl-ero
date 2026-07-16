import { useEffect, useMemo, useState } from 'react'
import {
	createTournament,
	deleteTournament,
	getTournaments,
	toggleTournamentActive,
	updateTournament,
} from '../../services/supabase/tournaments'
import { formatDisplayDate } from '../../utils/formatDisplayDate'

const initialForm = {
	title: '',
	tournament_date: '',
	registration_url: '',
	description: '',
	is_active: true,
	display_order: 0,
}

function isValidUrl(value) {
	if (!value) return true

	try {
		new URL(value)
		return true
	} catch {
		return false
	}
}

function sortTournaments(items) {
	return [...items].sort((a, b) => {
		const dateCompare = String(a.tournament_date).localeCompare(String(b.tournament_date))
		if (dateCompare !== 0) return dateCompare

		return Number(a.display_order ?? 0) - Number(b.display_order ?? 0)
	})
}

export default function TournamentsPage() {
	const [tournaments, setTournaments] = useState([])
	const [formData, setFormData] = useState(initialForm)
	const [editingTournamentId, setEditingTournamentId] = useState(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const isEditing = useMemo(() => Boolean(editingTournamentId), [editingTournamentId])

	useEffect(() => {
		loadTournaments()
	}, [])

	async function loadTournaments() {
		try {
			setLoading(true)
			setErrorMessage('')

			const data = await getTournaments()
			setTournaments(sortTournaments(data))
		} catch (error) {
			setErrorMessage(`Error loading tournaments: ${error.message}`)
		} finally {
			setLoading(false)
		}
	}

	function resetForm() {
		setFormData(initialForm)
		setEditingTournamentId(null)
		setErrorMessage('')
	}

	function handleChange(event) {
		const { name, value, type, checked } = event.target

		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	function handleEditClick(item) {
		setEditingTournamentId(item.id)
		setFormData({
			title: item.title || '',
			tournament_date: item.tournament_date || '',
			registration_url: item.registration_url || '',
			description: item.description || '',
			is_active: item.is_active ?? true,
			display_order: item.display_order ?? 0,
		})
		setErrorMessage('')
		setSuccessMessage('')
	}

	function handleCancelEdit() {
		resetForm()
		setSuccessMessage('')
	}

	async function handleSubmit(event) {
		event.preventDefault()

		const trimmedTitle = formData.title.trim()
		const trimmedUrl = formData.registration_url.trim()
		const trimmedDescription = formData.description.trim()

		if (!trimmedTitle) {
			setErrorMessage('Tournament title is required.')
			setSuccessMessage('')
			return
		}

		if (!formData.tournament_date) {
			setErrorMessage('Tournament date is required.')
			setSuccessMessage('')
			return
		}

		if (trimmedUrl && !isValidUrl(trimmedUrl)) {
			setErrorMessage('Registration link must be a valid URL.')
			setSuccessMessage('')
			return
		}

		try {
			setSaving(true)
			setErrorMessage('')
			setSuccessMessage('')

			const payload = {
				title: trimmedTitle,
				tournament_date: formData.tournament_date,
				registration_url: trimmedUrl || null,
				description: trimmedDescription || null,
				is_active: formData.is_active,
				display_order: Number(formData.display_order) || 0,
			}

			if (editingTournamentId) {
				await updateTournament(editingTournamentId, payload)
				setSuccessMessage('Tournament updated successfully.')
			} else {
				await createTournament(payload)
				setSuccessMessage('Tournament added successfully.')
			}

			await loadTournaments()
			resetForm()
		} catch (error) {
			setErrorMessage(
				`Error ${editingTournamentId ? 'updating' : 'adding'} tournament: ${error.message}`,
			)
		} finally {
			setSaving(false)
		}
	}

	async function handleToggleActive(item) {
		const confirmed = window.confirm(
			`Are you sure you want to ${item.is_active ? 'deactivate' : 'reactivate'} "${item.title}"?`,
		)

		if (!confirmed) return

		try {
			setErrorMessage('')
			setSuccessMessage('')

			const updatedTournament = await toggleTournamentActive(item.id, item.is_active)

			setTournaments(prev =>
				sortTournaments(prev.map(entry => (entry.id === item.id ? updatedTournament : entry))),
			)

			if (editingTournamentId === item.id) {
				setFormData(prev => ({
					...prev,
					is_active: updatedTournament.is_active,
				}))
			}

			setSuccessMessage(
				`Tournament ${updatedTournament.is_active ? 'reactivated' : 'deactivated'} successfully.`,
			)
		} catch (error) {
			setErrorMessage(`Error changing tournament status: ${error.message}`)
		}
	}

	async function handleDelete(item) {
		const confirmed = window.confirm(`Delete "${item.title}" permanently?\n\nThis cannot be undone.`)

		if (!confirmed) return

		try {
			setErrorMessage('')
			setSuccessMessage('')

			await deleteTournament(item.id)
			setTournaments(prev => prev.filter(entry => entry.id !== item.id))

			if (editingTournamentId === item.id) {
				resetForm()
			}

			setSuccessMessage('Tournament deleted successfully.')
		} catch (error) {
			setErrorMessage(`Error deleting tournament: ${error.message}`)
		}
	}

	return (
		<section className='admin-page tournaments-page'>
			<div className='admin-page__header'>
				<h1>Tournaments</h1>
				<p>Add and manage tournament dates and online registration links.</p>
			</div>

			<div className='admin-card'>
				<h2>{isEditing ? 'Edit Tournament' : 'Add Tournament'}</h2>

				<form className='tournament-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='title'>Tournament Title</label>
						<input
							id='title'
							name='title'
							type='text'
							value={formData.title}
							onChange={handleChange}
							placeholder='Enter tournament title'
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='tournament_date'>Tournament Date</label>
						<input
							id='tournament_date'
							name='tournament_date'
							type='date'
							value={formData.tournament_date}
							onChange={handleChange}
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='registration_url'>Registration Link</label>
						<input
							id='registration_url'
							name='registration_url'
							type='url'
							value={formData.registration_url}
							onChange={handleChange}
							placeholder='https://example.com/register'
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
							placeholder='Optional tournament details'
						/>
					</div>

					<div className='form-row'>
						<div className='form-group'>
							<label htmlFor='display_order'>Display Order</label>
							<input
								id='display_order'
								name='display_order'
								type='number'
								min='0'
								value={formData.display_order}
								onChange={handleChange}
							/>
						</div>

						<div className='form-checkbox tournament-form__checkbox'>
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

					<div className='form-actions'>
						<button type='submit' disabled={saving}>
							{saving
								? 'Saving...'
								: isEditing
									? 'Update Tournament'
									: 'Add Tournament'}
						</button>

						{isEditing && (
							<button type='button' className='secondary-button' onClick={handleCancelEdit}>
								Cancel Edit
							</button>
						)}
					</div>
				</form>
			</div>

			<div className='admin-card'>
				<div className='tournaments-page__list-header'>
					<h2>Current Tournaments</h2>
					{successMessage && <p className='status-message status-message--success'>{successMessage}</p>}
					{errorMessage && <p className='status-message status-message--error'>{errorMessage}</p>}
				</div>

				{loading ? (
					<p>Loading tournaments...</p>
				) : tournaments.length === 0 ? (
					<p>No tournaments found.</p>
				) : (
					<div className='tournament-list'>
						{tournaments.map(item => (
							<article
								className={`tournament-item ${!item.is_active ? 'tournament-item--inactive' : ''}`}
								key={item.id}
							>
								<div className='tournament-item__info'>
									<h3>{item.title}</h3>
									<p>
										<strong>Date:</strong> {formatDisplayDate(item.tournament_date)}
									</p>
									<p>
										<strong>Status:</strong> {item.is_active ? 'Active' : 'Inactive'}
									</p>
									<p>
										<strong>Display Order:</strong> {item.display_order ?? 0}
									</p>
									{item.registration_url && (
										<p>
											<strong>Registration:</strong>{' '}
											<a href={item.registration_url} target='_blank' rel='noreferrer'>
												Open link
											</a>
										</p>
									)}
									{item.description && <p>{item.description}</p>}
								</div>

								<div className='tournament-item__actions'>
									<button
										type='button'
										className='edit-button'
										onClick={() => handleEditClick(item)}
									>
										Edit
									</button>

									<button
										type='button'
										className={item.is_active ? 'warning-button' : 'success-button'}
										onClick={() => handleToggleActive(item)}
									>
										{item.is_active ? 'Deactivate' : 'Reactivate'}
									</button>

									<button
										type='button'
										className='danger-button'
										onClick={() => handleDelete(item)}
									>
										Delete
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	)
}