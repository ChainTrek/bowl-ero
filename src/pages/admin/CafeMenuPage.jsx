import { useEffect, useMemo, useState } from 'react'
import {
	getCafeMenuItems,
	uploadCafeMenuImage,
	createCafeMenuItem,
	updateCafeMenuItem,
	toggleCafeMenuItemActive,
	deleteCafeMenuItem,
} from '../../services/supabase/cafeMenu'

const initialForm = {
	name: '',
	description: '',
	is_active: true,
	display_order: 0,
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024

export default function CafeMenuPage() {
	const [items, setItems] = useState([])
	const [formData, setFormData] = useState(initialForm)
	const [imageFile, setImageFile] = useState(null)
	const [editingItemId, setEditingItemId] = useState(null)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')

	const imagePreviewUrl = useMemo(() => {
		if (!imageFile) return ''
		return URL.createObjectURL(imageFile)
	}, [imageFile])

	useEffect(() => {
		loadItems()
	}, [])

	useEffect(() => {
		return () => {
			if (imagePreviewUrl) {
				URL.revokeObjectURL(imagePreviewUrl)
			}
		}
	}, [imagePreviewUrl])

	async function loadItems() {
		try {
			setLoading(true)
			const data = await getCafeMenuItems()
			setItems(data)
		} catch (error) {
			setStatusMessage(`Error loading menu items: ${error.message}`)
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

	function validateImageFile(file) {
		if (!file) return 'Please choose an image.'
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
		setEditingItemId(item.id)
		setFormData({
			name: item.name || '',
			description: item.description || '',
			is_active: item.is_active,
			display_order: item.display_order ?? 0,
		})
		setImageFile(null)
		setStatusMessage('')
		const fileInput = document.getElementById('menu-image')
		if (fileInput) fileInput.value = ''
	}

	function handleCancelEdit() {
		setEditingItemId(null)
		setFormData(initialForm)
		setImageFile(null)
		setStatusMessage('')
		const fileInput = document.getElementById('menu-image')
		if (fileInput) fileInput.value = ''
	}

	async function handleSubmit(event) {
		event.preventDefault()

		if (!formData.name.trim()) {
			setStatusMessage('Menu item title is required.')
			return
		}

		try {
			setSubmitting(true)
			setStatusMessage('')

			if (editingItemId) {
				const updatedItem = await updateCafeMenuItem(editingItemId, {
					name: formData.name.trim(),
					description: formData.description.trim() || null,
					is_active: formData.is_active,
					display_order: Number(formData.display_order) || 0,
				})

				setItems(prev => prev.map(item => (item.id === editingItemId ? updatedItem : item)))

				setStatusMessage('Menu item updated successfully.')
			} else {
				const fileValidationMessage = validateImageFile(imageFile)

				if (fileValidationMessage) {
					setStatusMessage(fileValidationMessage)
					setSubmitting(false)
					return
				}

				const { imagePath, imageUrl } = await uploadCafeMenuImage(imageFile)

				const newItem = await createCafeMenuItem({
					name: formData.name.trim(),
					description: formData.description.trim() || null,
					image_path: imagePath,
					image_url: imageUrl,
					is_active: formData.is_active,
					display_order: Number(formData.display_order) || 0,
				})

				setItems(prev => [...prev, newItem])
				setStatusMessage('Menu item added successfully.')
			}

			setFormData(initialForm)
			setImageFile(null)
			setEditingItemId(null)

			const fileInput = document.getElementById('menu-image')
			if (fileInput) fileInput.value = ''
		} catch (error) {
			setStatusMessage(`Error ${editingItemId ? 'updating' : 'adding'} menu item: ${error.message}`)
		} finally {
			setSubmitting(false)
		}
	}

	async function handleToggleActive(item) {
		const confirmed = window.confirm(
			`Are you sure you want to ${item.is_active ? 'deactivate' : 'reactivate'} "${item.name}"?`,
		)

		if (!confirmed) return

		try {
			const updatedItem = await toggleCafeMenuItemActive(item.id, item.is_active)

			setItems(prev => prev.map(entry => (entry.id === item.id ? updatedItem : entry)))

			if (editingItemId === item.id) {
				setFormData(prev => ({
					...prev,
					is_active: updatedItem.is_active,
				}))
			}

			setStatusMessage(`Menu item ${updatedItem.is_active ? 'reactivated' : 'deactivated'} successfully.`)
		} catch (error) {
			setStatusMessage(`Error changing menu item status: ${error.message}`)
		}
	}

	async function handleDelete(item) {
		const confirmed = window.confirm(`Delete "${item.name}" permanently?\n\nThis cannot be undone.`)

		if (!confirmed) return

		try {
			await deleteCafeMenuItem(item.id)
			setItems(prev => prev.filter(entry => entry.id !== item.id))

			if (editingItemId === item.id) {
				handleCancelEdit()
			}

			setStatusMessage('Menu item deleted successfully.')
		} catch (error) {
			setStatusMessage(`Error deleting menu item: ${error.message}`)
		}
	}

	return (
		<section className='admin-page cafe-menu-page'>
			<div className='admin-page__header'>
				<h1>Cafe Menu</h1>
				<p>Add full menu images without changing code.</p>
			</div>

			<div className='admin-card'>
				<h2>{editingItemId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>

				<form className='menu-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='name'>Menu Title</label>
						<input
							id='name'
							name='name'
							type='text'
							value={formData.name}
							onChange={handleChange}
							placeholder='Cafe Menu'
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
							placeholder='Optional description'
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

					{!editingItemId && (
						<div className='form-group'>
							<label htmlFor='menu-image'>Menu Image</label>
							<input
								id='menu-image'
								type='file'
								accept='image/png,image/jpeg,image/webp'
								onChange={handleFileChange}
							/>
							<small>Allowed: JPG, PNG, WEBP. Max size: 2 MB.</small>
						</div>
					)}

					{editingItemId && (
						<p className='helper-text'>
							Image replacement is not included yet. This edit mode updates the title and
							description only.
						</p>
					)}

					{imagePreviewUrl && !editingItemId && (
						<div className='image-preview'>
							<p>Image Preview</p>
							<img src={imagePreviewUrl} alt='Selected menu item preview' />
						</div>
					)}

					<div className='form-actions'>
						<button type='submit' disabled={submitting}>
							{submitting ? 'Saving...' : editingItemId ? 'Update Menu Item' : 'Add Menu Item'}
						</button>

						{editingItemId && (
							<button type='button' className='secondary-button' onClick={handleCancelEdit}>
								Cancel Edit
							</button>
						)}
					</div>
				</form>
			</div>

			<div className='admin-card'>
				<h2>Current Menu Items</h2>

				{statusMessage && <p className='status-message'>{statusMessage}</p>}

				{loading ? (
					<p>Loading menu items...</p>
				) : items.length === 0 ? (
					<p>No menu items found.</p>
				) : (
					<div className='menu-item-list'>
						{items.map(item => (
							<article
								className={`menu-item-admin ${!item.is_active ? 'menu-item-admin--inactive' : ''}`}
								key={item.id}
							>
								{item.image_url && (
									<img
										className='menu-item-admin__image'
										src={item.image_url}
										alt={item.name}
									/>
								)}

								<div className='menu-item-admin__content'>
									<h3>{item.name}</h3>
									{item.description && <p>{item.description}</p>}

									<div className='menu-item-admin__actions'>
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
