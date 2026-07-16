import { useEffect, useMemo, useState } from 'react'
import {
	getCafeMenuItems,
	uploadCafeMenuImage,
	createCafeMenuItem,
	updateCafeMenuItem,
	replaceCafeMenuItemImage,
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

function sortItems(items) {
	return [...items].sort((a, b) => {
		const displayOrderCompare = Number(a.display_order ?? 0) - Number(b.display_order ?? 0)
		if (displayOrderCompare !== 0) return displayOrderCompare
		return String(a.name ?? '').localeCompare(String(b.name ?? ''))
	})
}

export default function CafeMenuPage() {
	const [items, setItems] = useState([])
	const [formData, setFormData] = useState(initialForm)
	const [imageFile, setImageFile] = useState(null)
	const [editingItemId, setEditingItemId] = useState(null)
	const [editingImagePath, setEditingImagePath] = useState('')
	const [editingImageUrl, setEditingImageUrl] = useState('')
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const imagePreviewUrl = useMemo(() => {
		if (!imageFile) return ''
		return URL.createObjectURL(imageFile)
	}, [imageFile])

	const isEditing = Boolean(editingItemId)

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
			setErrorMessage('')

			const data = await getCafeMenuItems()
			setItems(sortItems(data))
		} catch (error) {
			setErrorMessage(`Error loading menu items: ${error.message}`)
		} finally {
			setLoading(false)
		}
	}

	function clearFileInput() {
		const fileInput = document.getElementById('menu-image')
		if (fileInput) fileInput.value = ''
	}

	function resetForm() {
		setFormData(initialForm)
		setImageFile(null)
		setEditingItemId(null)
		setEditingImagePath('')
		setEditingImageUrl('')
		clearFileInput()
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
			setErrorMessage(validationMessage)
			setSuccessMessage('')
			setImageFile(null)
			event.target.value = ''
			return
		}

		setErrorMessage('')
		setSuccessMessage('')
		setImageFile(file)
	}

	function handleEditClick(item) {
		setEditingItemId(item.id)
		setEditingImagePath(item.image_path || '')
		setEditingImageUrl(item.image_url || '')
		setFormData({
			name: item.name || '',
			description: item.description || '',
			is_active: item.is_active ?? true,
			display_order: item.display_order ?? 0,
		})
		setImageFile(null)
		setErrorMessage('')
		setSuccessMessage('')
		clearFileInput()
	}

	function handleCancelEdit() {
		resetForm()
		setErrorMessage('')
		setSuccessMessage('')
	}

	async function handleSubmit(event) {
		event.preventDefault()

		const trimmedName = formData.name.trim()
		const trimmedDescription = formData.description.trim()

		if (!trimmedName) {
			setErrorMessage('Menu item title is required.')
			setSuccessMessage('')
			return
		}

		try {
			setSubmitting(true)
			setErrorMessage('')
			setSuccessMessage('')

			if (isEditing) {
				let updatedItem = await updateCafeMenuItem(editingItemId, {
					name: trimmedName,
					description: trimmedDescription || null,
					is_active: formData.is_active,
					display_order: Number(formData.display_order) || 0,
				})

				if (imageFile) {
					updatedItem = await replaceCafeMenuItemImage(
						editingItemId,
						imageFile,
						editingImagePath || null,
					)
				}

				setItems(prev =>
					sortItems(prev.map(item => (item.id === editingItemId ? updatedItem : item))),
				)

				setSuccessMessage('Menu item updated successfully.')
			} else {
				const fileValidationMessage = validateImageFile(imageFile)

				if (fileValidationMessage) {
					setErrorMessage(fileValidationMessage)
					setSubmitting(false)
					return
				}

				const { imagePath, imageUrl } = await uploadCafeMenuImage(imageFile)

				const newItem = await createCafeMenuItem({
					name: trimmedName,
					description: trimmedDescription || null,
					image_path: imagePath,
					image_url: imageUrl,
					is_active: formData.is_active,
					display_order: Number(formData.display_order) || 0,
				})

				setItems(prev => sortItems([...prev, newItem]))
				setSuccessMessage('Menu item added successfully.')
			}

			resetForm()
		} catch (error) {
			setErrorMessage(`Error ${isEditing ? 'updating' : 'adding'} menu item: ${error.message}`)
			setSuccessMessage('')
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
			setErrorMessage('')
			setSuccessMessage('')

			const updatedItem = await toggleCafeMenuItemActive(item.id, item.is_active)

			setItems(prev => sortItems(prev.map(entry => (entry.id === item.id ? updatedItem : entry))))

			if (editingItemId === item.id) {
				setFormData(prev => ({
					...prev,
					is_active: updatedItem.is_active,
				}))
			}

			setSuccessMessage(
				`Menu item ${updatedItem.is_active ? 'reactivated' : 'deactivated'} successfully.`,
			)
		} catch (error) {
			setErrorMessage(`Error changing menu item status: ${error.message}`)
			setSuccessMessage('')
		}
	}

	async function handleDelete(item) {
		const confirmed = window.confirm(`Delete "${item.name}" permanently?\n\nThis cannot be undone.`)

		if (!confirmed) return

		try {
			setErrorMessage('')
			setSuccessMessage('')

			await deleteCafeMenuItem(item.id, item.image_path || null)
			setItems(prev => prev.filter(entry => entry.id !== item.id))

			if (editingItemId === item.id) {
				resetForm()
			}

			setSuccessMessage('Menu item deleted successfully.')
		} catch (error) {
			setErrorMessage(`Error deleting menu item: ${error.message}`)
			setSuccessMessage('')
		}
	}

	return (
		<section className='admin-page cafe-menu-page'>
			<div className='admin-page__header'>
				<h1>Cafe Menu</h1>
				<p>Add and manage full menu images without changing code.</p>
			</div>

			<div className='admin-card'>
				<h2>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</h2>

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

					<div className='form-group'>
						<label htmlFor='menu-image'>
							{isEditing ? 'Replace Menu Image (Optional)' : 'Menu Image'}
						</label>
						<input
							id='menu-image'
							type='file'
							accept='image/png,image/jpeg,image/webp'
							onChange={handleFileChange}
						/>
						<small>Allowed: JPG, PNG, WEBP. Max size: 2 MB.</small>
					</div>

					{isEditing && editingImageUrl && !imagePreviewUrl && (
						<div className='image-preview'>
							<p>Current Image</p>
							<img src={editingImageUrl} alt={formData.name || 'Current menu item'} />
						</div>
					)}

					{imagePreviewUrl && (
						<div className='image-preview'>
							<p>{isEditing ? 'New Image Preview' : 'Image Preview'}</p>
							<img src={imagePreviewUrl} alt='Selected menu item preview' />
						</div>
					)}

					<div className='form-actions'>
						<button type='submit' disabled={submitting}>
							{submitting ? 'Saving...' : isEditing ? 'Update Menu Item' : 'Add Menu Item'}
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
				<h2>Current Menu Items</h2>

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
									<p>
										<strong>Status:</strong> {item.is_active ? 'Active' : 'Inactive'}
									</p>
									<p>
										<strong>Display Order:</strong> {item.display_order ?? 0}
									</p>
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

										<button
											type='button'
											className='danger-button'
											onClick={() => handleDelete(item)}
										>
											Delete
										</button>
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