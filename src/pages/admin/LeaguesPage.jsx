import { useEffect, useState } from 'react'
import { getLeagues, createLeague, deleteLeague } from '../../services/supabase/leagues'

const initialForm = {
  name: '',
  day_of_week: '',
  is_active: true
}

export default function LeaguesPage(){
  const [leagues, setLeagues] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    loadLeagues()
  }, [])

  async function loadLeagues() {
    try{
      setLoading(true)
      const data = await getLeagues()
      setLeagues(data)
    } catch (error) {
      setStatusMessage(`Error loading leagues: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if(!formData.name.trim()) {
      setStatusMessage('League name is required.')
      return
    }

    try {
      setSubmitting(true)
      setStatusMessage('')

      const newLeague = await createLeague({
        name: formData.name.trim(),
        day_of_week: formData.day_of_week || null,
        is_active: formData.is_active
      })

      setLeagues((prev) => [newLeague, ...prev])
      setFormData(initialForm)
      setStatusMessage('League added successfully.')
    } catch (error) {
      setStatusMessage(`Error adding league: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this league?')

    if(!confirmed) return

    try {
      await deleteLeague(id)
      setLeagues((prev) => prev.filter((league) => league.id !== id))
      setStatusMessage('League deleted successfully.')
    } catch (error) {
      setStatusMessage(`Error deleting league: ${error.message}`)
    }
  }

  return (
    <section className="admin-page leagues-page">
      <div className="admin-page__header">
        <h1>Leagues</h1>
        <p>Add and manage league names.</p>
      </div>

      <div className="admin-card">
        <h2>Add League</h2>
        <form className="league-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">League Name</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder='Enter league name' />
          </div>
          <div className="form-group">
            <label htmlFor="day_of_week">Day of Week</label>
            <select id='day_of_week' name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
              <option value="">Select a day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div className="form-checkbox">
            <label htmlFor="is_active">
              <input id='is_active' name='is_active' type='checkbox' checked={formData.is_active} onChange={handleChange} />
              Active
            </label>
          </div>
          <button type='submit' disabled={submitting}>
            {submitting ? 'Saving...' : 'Add League'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Current Leagues</h2>
        {statusMessage && <p className='status-message'>{statusMessage}</p>}
        {loading ? (
          <p>Loading leagues...</p>
        ) : leagues.length === 0 ? (
          <p>No leagues found.</p>
        ): (
          <div className="league-list">
            {leagues.map((league) => (
              <article className="league-item" key={league.id}>
                <div className="league-item__info">
                  <h3>{league.name}</h3>
                  <p>
                    Day: {league.day_of_week || 'Not set'} | Status: {' '}
                    {league.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="league-item__actions">
                  <button type='button' className='danger-button' onClick={() => handleDelete(league.id)}>
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