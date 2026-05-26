import { useEffect, useState } from 'react'
import {
	getTournaments,
	createTournament,
	updateTournament,
	toggleTournamentActive,
	deleteTournament,
} from '../../services/supabase/tournaments'

const initialForm = {
	title: '',
	tournament_date: '',
	registration_url: '',
	description: '',
	is_active: true,
	display_order: 0,
}

export default function TournamentsPage() {
	const [tournaments, setTournaments] = useState([])
	const [formData, setFormData] = useState(initialForm)
	const [editingTournamentId, setEditingTournamentId] = useState(null)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')

	useEffect(() => {
		loadTournaments()
	}, [])

	async function loadTournaments() {
		try {
			setLoading(true)
			const data = await getTournaments()
			setTournaments(data)
		} catch (error) {
			setStatusMessage(`Error loading tournaments: ${error.message}`)
		} finally {
			setLoading(false)
		}
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
			is_active: item.is_active,
			display_order: item.display_order ?? 0,
		})
		setStatusMessage('')
	}

	function handleCancelEdit() {
		setEditingTournamentId(null)
		setFormData(initialForm)
		setStatusMessage('')
	}

	async function handleSubmit(event) {
		event.preventDefault()

		if (!formData.title.trim()) {
			setStatusMessage('Tournament title is required.')
			return
		}

		if (!formData.tournament_date) {
			setStatusMessage('Tournament date is required.')
			return
		}

		try {
			setSubmitting(true)
			setStatusMessage('')

			const payload = {
				title: formData.title.trim(),
				tournament_date: formData.tournament_date,
				registration_url: formData.registration_url.trim() || null,
				description: formData.description.trim() || null,
				is_active: formData.is_active,
				display_order: Number(formData.display_order) || 0,
			}

			if (editingTournamentId) {
				const updatedTournament = await updateTournament(editingTournamentId, payload)

				setTournaments(prev =>
					prev.map(item => (item.id === editingTournamentId ? updatedTournament : item)),
				)

				setStatusMessage('Tournament updated successfully.')
			} else {
				const newTournament = await createTournament(payload)
				setTournaments(prev => [...prev, newTournament])
				setStatusMessage('Tournament added successfully.')
			}

			setFormData(initialForm)
			setEditingTournamentId(null)
		} catch (error) {
			setStatusMessage(`Error ${editingTournamentId ? 'updating' : 'adding'} tournament: ${error.message}`)
		} finally {
			setSubmitting(false)
		}
	}

	async function handleToggleActive(item) {
		const confirmed = window.confirm(
			`Are you sure you want to ${item.is_active ? 'deactivate' : 'reactivate'} "${item.title}"?`,
		)

		if (!confirmed) return

		try {
			const updatedTournament = await toggleTournamentActive(item.id, item.is_active)

			setTournaments(prev => prev.map(entry => (entry.id === item.id ? updatedTournament : entry)))

			if (editingTournamentId === item.id) {
				setFormData(prev => ({
					...prev,
					is_active: updatedTournament.is_active,
				}))
			}

			setStatusMessage(
				`Tournament ${updatedTournament.is_active ? 'reactivated' : 'deactivated'} successfully.`,
			)
		} catch (error) {
			setStatusMessage(`Error changing tournament status: ${error.message}`)
		}
	}

	async function handleDelete(item) {
		const confirmed = window.confirm(`Delete "${item.title}" permanently?\n\nThis cannot be undone.`)

		if (!confirmed) return

		try {
			await deleteTournament(item.id)
			setTournaments(prev => prev.filter(entry => entry.id !== item.id))

			if (editingTournamentId === item.id) {
				handleCancelEdit()
			}

			setStatusMessage('Tournament deleted successfully.')
		} catch (error) {
			setStatusMessage(`Error deleting tournament: ${error.message}`)
		}
	}

	return (
		<section className='admin-page tournaments-page'>
			<div className='admin-page__header'>
				<h1>Tournaments</h1>
				<p>Add and manage tournament dates and online registration links.</p>
			</div>

			<div className='admin-card'>
				<h2>{editingTournamentId ? 'Edit Tournament' : 'Add Tournament'}</h2>

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

						<div className='form-checkbox'>
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
						<button type='submit' disabled={submitting}>
							{submitting
								? 'Saving...'
								: editingTournamentId
									? 'Update Tournament'
									: 'Add Tournament'}
						</button>

						{editingTournamentId && (
							<button type='button' className='secondary-button' onClick={handleCancelEdit}>
								Cancel Edit
							</button>
						)}
					</div>
				</form>
			</div>

			<div className='admin-card'>
				<h2>Current Tournaments</h2>

				{statusMessage && <p className='status-message'>{statusMessage}</p>}

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
									<p>Date: {item.tournament_date}</p>
									{item.registration_url && <p>Registration link saved</p>}
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

									<details className='advanced-actions'>
										<summary>Advanced Actions</summary>

										<button
											type='button'
											className='danger-button'
											onClick={() => handleDelete(item)}
										>
											Delete Permanently
										</button>
									</details>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
