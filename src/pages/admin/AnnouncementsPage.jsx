import { useEffect, useMemo, useState } from 'react'
import {
	getAnnouncements,
	uploadAnnouncementImage,
	createAnnouncement,
	updateAnnouncement,
	toggleAnnouncementActive,
	deleteAnnouncement,
} from '../../services/supabase/announcements'

const initialForm = {
	title: '',
	description: '',
	link_url: '',
	start_date: '',
	end_date: '',
	is_active: true,
	display_order: 0,
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024

export default function AnnouncementsPage() {
	const [announcements, setAnnouncements] = useState([])
	const [formData, setFormData] = useState(initialForm)
	const [imageFile, setImageFile] = useState(null)
	const [editingAnnouncementId, setEditingAnnouncementId] = useState(null)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')

	const imagePreviewUrl = useMemo(() => {
		if (!imageFile) return ''
		return URL.createObjectURL(imageFile)
	}, [imageFile])

	useEffect(() => {
		loadAnnouncements()
	}, [])

	useEffect(() => {
		return () => {
			if (imagePreviewUrl) {
				URL.revokeObjectURL(imagePreviewUrl)
			}
		}
	}, [imagePreviewUrl])

	async function loadAnnouncements() {
		try {
			setLoading(true)
			const data = await getAnnouncements()
			setAnnouncements(data)
		} catch (error) {
			setStatusMessage(`Error loading announcements: ${error.message}`)
		} finally {
			setLoading(false)
		}
	}

	async function handleDelete(item) {
		const confirmed = window.confirm(`Delete "${item.title}" permanently?\n\nThis cannot be undone.`)

		if (!confirmed) return

		try {
			await deleteAnnouncement(item.id)
			setAnnouncements(prev => prev.filter(entry => entry.id !== item.id))

			if (editingAnnouncementId === item.id) {
				handleCancelEdit()
			}

			setStatusMessage('Announcement deleted successfully.')
		} catch (error) {
			setStatusMessage(`Error deleting announcement: ${error.message}`)
		}
	}

	function handleChange(event) {
		const { name, value, type, checked } = event.target

		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	function validateImageFile(file) {
		if (!file) {
			return 'Please choose an image.'
		}

		if (!ALLOWED_FILE_TYPES.includes(file.type)) {
			return 'Only JPG, PNG, and WEBP images are allowed.'
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			return 'Image must be 2 MB or smaller.'
		}

		return ''
	}

	function handleFileChange(event) {
		const file = event.target.files?.[0] || null

		if (!file) {
			setImageFile(null)
			return
		}

		const validationMessage = validateImageFile(file)

		if (validationMessage) {
			setStatusMessage(validationMessage)
			setImageFile(null)
			event.target.value = ''
			return
		}

		setStatusMessage('')
		setImageFile(file)
	}

	function handleEditClick(item) {
		setEditingAnnouncementId(item.id)
		setFormData({
			title: item.title || '',
			description: item.description || '',
			link_url: item.link_url || '',
			start_date: item.start_date || '',
			end_date: item.end_date || '',
			is_active: item.is_active,
			display_order: item.display_order ?? 0,
		})
		setImageFile(null)
		setStatusMessage('')
		const fileInput = document.getElementById('announcement-image')
		if (fileInput) {
			fileInput.value = ''
		}
	}

	function handleCancelEdit() {
		setEditingAnnouncementId(null)
		setFormData(initialForm)
		setImageFile(null)
		setStatusMessage('')
		const fileInput = document.getElementById('announcement-image')
		if (fileInput) {
			fileInput.value = ''
		}
	}

	async function handleSubmit(event) {
		event.preventDefault()

		if (!formData.title.trim()) {
			setStatusMessage('Title is required.')
			return
		}

		if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
			setStatusMessage('End date cannot be earlier than start date.')
			return
		}

		try {
			setSubmitting(true)
			setStatusMessage('')

			if (editingAnnouncementId) {
				const updatedAnnouncement = await updateAnnouncement(editingAnnouncementId, {
					title: formData.title.trim(),
					description: formData.description.trim() || null,
					link_url: formData.link_url.trim() || null,
					start_date: formData.start_date || null,
					end_date: formData.end_date || null,
					is_active: formData.is_active,
					display_order: Number(formData.display_order) || 0,
				})

				setAnnouncements(prev =>
					prev.map(item => (item.id === editingAnnouncementId ? updatedAnnouncement : item)),
				)

				setStatusMessage('Announcement updated successfully.')
			} else {
				const fileValidationMessage = validateImageFile(imageFile)

				if (fileValidationMessage) {
					setStatusMessage(fileValidationMessage)
					setSubmitting(false)
					return
				}

				const { imagePath, imageUrl } = await uploadAnnouncementImage(imageFile)

				const newAnnouncement = await createAnnouncement({
					title: formData.title.trim(),
					description: formData.description.trim() || null,
					image_path: imagePath,
					image_url: imageUrl,
					link_url: formData.link_url.trim() || null,
					start_date: formData.start_date || null,
					end_date: formData.end_date || null,
					is_active: formData.is_active,
					display_order: Number(formData.display_order) || 0,
				})

				setAnnouncements(prev => [newAnnouncement, ...prev])
				setStatusMessage('Announcement added successfully.')
			}

			setFormData(initialForm)
			setImageFile(null)
			setEditingAnnouncementId(null)

			const fileInput = document.getElementById('announcement-image')
			if (fileInput) {
				fileInput.value = ''
			}
		} catch (error) {
			setStatusMessage(`Error ${editingAnnouncementId ? 'updating' : 'adding'} announcement: ${error.message}`)
		} finally {
			setSubmitting(false)
		}
	}

	async function handleToggleActive(item) {
		const actionLabel = item.is_active ? 'deactivate' : 'reactivate'
		const confirmed = window.confirm(`Are you sure you want to ${actionLabel} "${item.title}"?`)

		if (!confirmed) return

		try {
			const updatedAnnouncement = await toggleAnnouncementActive(item.id, item.is_active)

			setAnnouncements(prev => prev.map(entry => (entry.id === item.id ? updatedAnnouncement : entry)))

			if (editingAnnouncementId === item.id) {
				setFormData(prev => ({
					...prev,
					is_active: updatedAnnouncement.is_active,
				}))
			}

			setStatusMessage(
				`Announcement ${updatedAnnouncement.is_active ? 'reactivated' : 'deactivated'} successfully.`,
			)
		} catch (error) {
			setStatusMessage(`Error changing announcement status: ${error.message}`)
		}
	}

	return (
		<section className='admin-page announcements-page'>
			<div className='admin-page__header'>
				<h1>Announcements</h1>
				<p>Upload flyer images and manage announcements without changing code.</p>
			</div>

			<div className='admin-card'>
				<h2>{editingAnnouncementId ? 'Edit Announcement' : 'Add Announcement'}</h2>

				<form className='announcement-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='title'>Title</label>
						<input
							id='title'
							name='title'
							type='text'
							value={formData.title}
							onChange={handleChange}
							placeholder='Enter announcement title'
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='description'>Description</label>
						<textarea
							id='description'
							name='description'
							value={formData.description}
							onChange={handleChange}
							placeholder='Optional description'
							rows='4'
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='link_url'>Link URL</label>
						<input
							id='link_url'
							name='link_url'
							type='url'
							value={formData.link_url}
							onChange={handleChange}
							placeholder='https://example.com'
						/>
					</div>

					<div className='form-row'>
						<div className='form-group'>
							<label htmlFor='start_date'>Start Date</label>
							<input
								id='start_date'
								name='start_date'
								type='date'
								value={formData.start_date}
								onChange={handleChange}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='end_date'>End Date</label>
							<input
								id='end_date'
								name='end_date'
								type='date'
								value={formData.end_date}
								onChange={handleChange}
							/>
						</div>
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

					{!editingAnnouncementId && (
						<div className='form-group'>
							<label htmlFor='announcement-image'>Flyer Image</label>
							<input
								id='announcement-image'
								type='file'
								accept='image/png,image/jpeg,image/webp'
								onChange={handleFileChange}
							/>
							<small>Allowed: JPG, PNG, WEBP. Max size: 2 MB.</small>
						</div>
					)}

					{editingAnnouncementId && (
						<p className='helper-text'>
							Image replacement is not included yet. This edit mode updates the announcement
							details only.
						</p>
					)}

					{imagePreviewUrl && !editingAnnouncementId && (
						<div className='image-preview'>
							<p>Image Preview</p>
							<img src={imagePreviewUrl} alt='Selected announcement preview' />
						</div>
					)}

					<div className='form-actions'>
						<button type='submit' disabled={submitting}>
							{submitting
								? 'Saving...'
								: editingAnnouncementId
									? 'Update Announcement'
									: 'Add Announcement'}
						</button>

						{editingAnnouncementId && (
							<button type='button' className='secondary-button' onClick={handleCancelEdit}>
								Cancel Edit
							</button>
						)}
					</div>
				</form>
			</div>

			<div className='admin-card'>
				<h2>Current Announcements</h2>

				{statusMessage && <p className='status-message'>{statusMessage}</p>}

				{loading ? (
					<p>Loading announcements...</p>
				) : announcements.length === 0 ? (
					<p>No announcements found.</p>
				) : (
					<div className='announcement-list'>
						{announcements.map(item => (
							<article
								className={`announcement-item ${!item.is_active ? 'announcement-item--inactive' : ''}`}
								key={item.id}
							>
								{item.image_url && (
									<img
										className='announcement-item__image'
										src={item.image_url}
										alt={item.title}
									/>
								)}

								<div className='announcement-item__content'>
									<h3>{item.title}</h3>
									<p>Status: {item.is_active ? 'Active' : 'Inactive'}</p>

									{item.description && <p>{item.description}</p>}

									{item.link_url && (
										<p>
											Link:{' '}
											<a href={item.link_url} target='_blank' rel='noreferrer'>
												{item.link_url}
											</a>
										</p>
									)}

									<p>
										Start: {item.start_date || 'Not set'} | End:{' '}
										{item.end_date || 'Not set'}
									</p>

									<p>Display Order: {item.display_order}</p>

									<div className='announcement-item__actions'>
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
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
