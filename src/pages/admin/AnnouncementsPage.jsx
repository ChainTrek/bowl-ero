import { useEffect, useState } from 'react'
import { getAnnouncements, uploadAnnouncementImage, createAnnouncement } from '../../services/supabase/announcements'

const initialForm = {
  title: '',
  description: '',
  link_url: '',
  start_date: '',
  end_date: '',
  is_active: true,
  display_order: 0,
}

export default function AnnouncementsPage(){
  const [announcements, setAnnouncements] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

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

  useEffect(() => {
    loadAnnouncements()
  }, [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null
    setImageFile(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if(!formData.title.trim()) {
      setStatusMessage('Title is required.')
      return
    }

    if(!imageFile) {
      setStatusMessage('Please choose an image.')
      return
    }

    try {
      setSubmitting(true)
      setStatusMessage('')

      const { imagePath, imageUrl } = await uploadAnnouncementImage(imageFile)

      const newAnnouncement = await createAnnouncement({
        title: formData.title.trim(),
        description: formData.description.trim || null,
        image_path: imagePath,
        image_url: imageUrl,
        link_url: formData.link_url.trim() || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_active: formData.is_active,
        display_order: Number(formData.display_order) || 0,
      })

      setAnnouncements((prev) => [newAnnouncement, ...prev])
      setFormData(initialForm)
      setImageFile(null)
      setStatusMessage('Announcement added successfully.')

      const fileInput = document.getElementById('announcement-image')

      if(fileInput) {
        fileInput.value = ''
      }
    } catch (error) {
      setStatusMessage(`Error adding announcement: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return(
    <section className="admin-page announcements-page">
      <div className="admin-page__header">
        <h1>Announcements</h1>
        <p>Upload flyer or image and manage announcements without changing code.</p>
      </div>

      <div className="admin-card">
        <h2>Add Announcements</h2>
        <form className="announcement-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name='title' type='text' value={formData.title} onChange={handleChange} placeholder='Enter announcement title' />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} placeholder='Optional description' rows='4' />
          </div>
          <div className="form-group">
            <label htmlFor="link_url">Link URL</label>
            <input type="url" id="link_url" name='link_url' value={formData.link_url} onChange={handleChange} placeholder='https://example.com' />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input type="date" id="start_date" name='start_date' value={formData.start_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input type="date" id="end_date" name='end_date' value={formData.end_date} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="display_order">Display Order</label>
              <input type="number" id="display_order" name='display_order' min='0' value={formData.display_order} onChange={handleChange} />
            </div>
            <div className="form-checkbox">
              <label htmlFor="is_active">
                <input type="checkbox" id="is_active" name='is_active' checked={formData.is_active} onChange={handleChange} />
                Active
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="announcement-image">Flyer Image</label>
            <input type="file" id="announcement-image" accept='image/png,image/jpeg,image/webp' onChange={handleFileChange} />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Add Announcement'}
          </button>
        </form>
      </div>
      <div className="admin-card">
        <h2>Current Announcements</h2>
        {statusMessage && <p className='status-message'>{statusMessage}</p>}
        {
          loading ? (
            <p>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p>No announcements found.</p>
          ) : (
            <div className="announcement-list">
              {announcements.map((item) => (
                <article className="announcement-item" key={item.id}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="announcement-item__image" />
                  )}
                  <div className="announcement-item__content">
                    <h3>{item.title}</h3>
                    <p>Status: {item.is_active ? 'Active' : 'Inactive'}</p>
                    {item.description && <p>{item.description}</p>}
                    {item.link_url && (
                      <p>
                        Link:{' '}
                        <a href={item.link_url} target='_blank' rel='nonreferrer'>{item.link_url}</a>
                      </p>
                    )}
                    <p>
                      Start: {item.start_date || 'Not set'} | End: {item.end_date || 'Not set'}
                    </p>
                    <p>Display Order: {item.display_order}</p>
                  </div>
                </article>
              ))}
            </div>
          )
        }
      </div>
    </section>
  )
}