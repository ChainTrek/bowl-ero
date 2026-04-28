import { useEffect, useState } from 'react';
import {
  getLeagues,
  createLeague,
  updateLeague,
  toggleLeagueActive,
} from '../../services/supabase/leagues';

const initialForm = {
  name: '',
  day_of_week: '',
  is_active: true,
};

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingLeagueId, setEditingLeagueId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadLeagues();
  }, []);

  async function loadLeagues() {
    try {
      setLoading(true);
      const data = await getLeagues();
      setLeagues(data);
    } catch (error) {
      setStatusMessage(`Error loading leagues: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleEditClick(league) {
    setEditingLeagueId(league.id);
    setFormData({
      name: league.name || '',
      day_of_week: league.day_of_week || '',
      is_active: league.is_active,
    });
    setStatusMessage('');
  }

  function handleCancelEdit() {
    setEditingLeagueId(null);
    setFormData(initialForm);
    setStatusMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      setStatusMessage('League name is required.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      day_of_week: formData.day_of_week || null,
      is_active: formData.is_active,
    };

    try {
      setSubmitting(true);
      setStatusMessage('');

      if (editingLeagueId) {
        const updatedLeague = await updateLeague(editingLeagueId, payload);

        setLeagues((prev) =>
          prev.map((league) =>
            league.id === editingLeagueId ? updatedLeague : league
          )
        );

        setStatusMessage('League updated successfully.');
      } else {
        const newLeague = await createLeague(payload);
        setLeagues((prev) => [newLeague, ...prev]);
        setStatusMessage('League added successfully.');
      }

      setFormData(initialForm);
      setEditingLeagueId(null);
    } catch (error) {
      setStatusMessage(
        `Error ${editingLeagueId ? 'updating' : 'adding'} league: ${error.message}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(league) {
    const actionLabel = league.is_active ? 'deactivate' : 'reactivate';
    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} "${league.name}"?`
    );

    if (!confirmed) return;

    try {
      const updatedLeague = await toggleLeagueActive(league.id, league.is_active);

      setLeagues((prev) =>
        prev.map((item) => (item.id === league.id ? updatedLeague : item))
      );

      if (editingLeagueId === league.id) {
        setFormData((prev) => ({
          ...prev,
          is_active: updatedLeague.is_active,
        }));
      }

      setStatusMessage(
        `League ${updatedLeague.is_active ? 'reactivated' : 'deactivated'} successfully.`
      );
    } catch (error) {
      setStatusMessage(`Error changing league status: ${error.message}`);
    }
  }

  return (
    <section className="admin-page leagues-page">
      <div className="admin-page__header">
        <h1>Leagues</h1>
        <p>Add, edit, and activate/deactivate league names.</p>
      </div>

      <div className="admin-card">
        <h2>{editingLeagueId ? 'Edit League' : 'Add League'}</h2>

        <form className="league-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">League Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter league name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="day_of_week">Day of Week</label>
            <select
              id="day_of_week"
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
            >
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
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? 'Saving...'
                : editingLeagueId
                ? 'Update League'
                : 'Add League'}
            </button>

            {editingLeagueId && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>Current Leagues</h2>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        {loading ? (
          <p>Loading leagues...</p>
        ) : leagues.length === 0 ? (
          <p>No leagues found.</p>
        ) : (
          <div className="league-list">
            {leagues.map((league) => (
              <article
                className={`league-item ${!league.is_active ? 'league-item--inactive' : ''}`}
                key={league.id}
              >
                <div className="league-item__info">
                  <h3>{league.name}</h3>
                  <p>
                    Day: {league.day_of_week || 'Not set'} | Status:{' '}
                    {league.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>

                <div className="league-item__actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEditClick(league)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className={league.is_active ? 'warning-button' : 'success-button'}
                    onClick={() => handleToggleActive(league)}
                  >
                    {league.is_active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}