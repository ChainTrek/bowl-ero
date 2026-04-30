import { useEffect, useState } from 'react'
import { getHours, updateHoursRow } from '../../services/supabase/hours'

export default function HoursPage(){
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingRowId, setSavingRowId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')

  async function loadHours() {
    try {
      setLoading(true)
      const data = await getHours();
      setHours(data)
    } catch (error) {
      setStatusMessage(`Error loading hours: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHours()
  }, [])

  function handleChange(id, field, value) {
    setHours((prev) => prev.map((row) => row.id === id ? { ...row, [field]: value } : row))
  }

  async function handleSave(row) {
    try {
      setSavingRowId(row.id)
      setStatusMessage('')

      const payload = {
        day_of_week: row.day_of_week,
        open_time: row.is_closed ? null : row.open_time || null,
        close_time: row.is_closed ? null : row.close_time || null,
        is_closed: row.is_closed,
        display_order: row.display_order
      }

      const updateRow = await updateHoursRow(row.id, payload)

      setHours((prev) => prev.map((item) => (item.id === row.id ? updateRow : item)))
      setStatusMessage(`${row.day_of_week} updated successfully.`)
    } catch (error) {
      setStatusMessage(`Error saving hours: ${error.message}`)
    } finally {
      setSavingRowId(null)
    }
  }

  return(
    <section className="admin-page hours-page">
      <div className="admin-page__header">
        <h1>Hours of Operation</h1>
        <p>Update business hours without changing code.</p>
      </div>

      <div className="admin-card">
        <h2>Weekly Hours</h2>
        {statusMessage && <p className='status-message'>{statusMessage}</p>}

        {loading ? (
          <p>Loading hours...</p>
        ) : (
          <div className="hours-list">
            {hours.map((row) => (
              <article className="hours-item" key={row.id}>
                <div className="hours-item__day">
                  <h3>{row.day_of_week}</h3>
                </div>

                <div className="hours-item__day">
                  <div className="form-checkbox">
                    <label htmlFor={`closed-${row.id}`}>
                      <input id={`closed-row.id`} type='checkbox' checked={row.is_closed} onChange={(event) => handleChange(
                        row.id, 'is_closed', event.target.checked
                        )} />
                      Closed
                    </label>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`open-${row.id}`}>Open</label>
                    <input id={`open-${row.id}`} type='text' value={row.open_time || ''} onChange={(event) => handleChange(
                      row.id, 'open_time', event.target.value
                    )} disabled={row.is_closed} placeholder='11:00 AM' />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`close-${row.id}`}>Close</label>
                    <input id={`close-row.id`} type='text' value={row.close_time || ''} onChange={(event) => handleChange(
                      row.id, 'close_time', event.target.value
                    )} disabled={row.is_closed} placeholder='10:00 PM' />
                  </div>
                </div>

                <div className="hours-item__actions">
                  <button type='button' onClick={() => handleSave(row)} disabled={savingRowId === row.id}>
                    {savingRowId === row.id ? 'Saving...' : 'Save'}
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