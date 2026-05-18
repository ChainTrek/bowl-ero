import { useEffect, useState } from 'react';
import {
  getActiveLeagues,
  getLeagueWeeks,
  createLeagueWeek,
  updateLeagueWeek,
} from '../../services/supabase/scores';

const initialForm = {
  league_id: '',
  week_label: '',
  week_date: '',
};

export default function ScoresPage() {
  const [leagues, setLeagues] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingWeekId, setEditingWeekId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      setLoading(true);

      const [leagueData, weekData] = await Promise.all([
        getActiveLeagues(),
        getLeagueWeeks(),
      ]);

      setLeagues(leagueData);
      setWeeks(weekData);
    } catch (error) {
      setStatusMessage(`Error loading scores data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditClick(week) {
    setEditingWeekId(week.id);
    setFormData({
      league_id: String(week.league_id ?? ''),
      week_label: week.week_label || '',
      week_date: week.week_date || '',
    });
    setStatusMessage('');
  }

  function handleCancelEdit() {
    setEditingWeekId(null);
    setFormData(initialForm);
    setStatusMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.league_id) {
      setStatusMessage('Please choose a league.');
      return;
    }

    if (!formData.week_label.trim()) {
      setStatusMessage('Week label is required.');
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage('');

      const payload = {
        league_id: Number(formData.league_id),
        week_label: formData.week_label.trim(),
        week_date: formData.week_date || null,
      };

      if (editingWeekId) {
        const updatedWeek = await updateLeagueWeek(editingWeekId, payload);

        setWeeks((prev) =>
          prev.map((week) => (week.id === editingWeekId ? updatedWeek : week))
        );

        setStatusMessage('Weekly entry updated successfully.');
      } else {
        const newWeek = await createLeagueWeek(payload);
        setWeeks((prev) => [newWeek, ...prev]);
        setStatusMessage('Weekly entry created successfully.');
      }

      setFormData(initialForm);
      setEditingWeekId(null);
    } catch (error) {
      setStatusMessage(
        `Error ${editingWeekId ? 'updating' : 'creating'} weekly entry: ${error.message}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="admin-page scores-page">
      <div className="admin-page__header">
        <h1>Weekly Scores</h1>
        <p>Create and manage weekly score entries for each league.</p>
      </div>

      <div className="admin-card">
        <h2>{editingWeekId ? 'Edit Weekly Entry' : 'Create Weekly Entry'}</h2>

        <form className="score-week-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="league_id">League</label>
            <select
              id="league_id"
              name="league_id"
              value={formData.league_id}
              onChange={handleChange}
            >
              <option value="">Select a league</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                  {league.day_of_week ? ` (${league.day_of_week})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="week_label">Week Label</label>
            <input
              id="week_label"
              name="week_label"
              type="text"
              value={formData.week_label}
              onChange={handleChange}
              placeholder="Example: April 27, 2026"
            />
          </div>

          <div className="form-group">
            <label htmlFor="week_date">Week Date</label>
            <input
              id="week_date"
              name="week_date"
              type="date"
              value={formData.week_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? 'Saving...'
                : editingWeekId
                ? 'Update Weekly Entry'
                : 'Create Weekly Entry'}
            </button>

            {editingWeekId && (
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
        <h2>Existing Weekly Entries</h2>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        {loading ? (
          <p>Loading weekly entries...</p>
        ) : weeks.length === 0 ? (
          <p>No weekly entries found yet.</p>
        ) : (
          <div className="score-week-list">
            {weeks.map((week) => (
              <article className="score-week-item" key={week.id}>
                <div className="score-week-item__info">
                  <h3>{week.week_label}</h3>
                  <p>
                    League: {week.leagues?.name || 'Unknown league'}
                    {week.leagues?.day_of_week ? ` (${week.leagues.day_of_week})` : ''}
                  </p>
                  <p>
                    Week Date: {week.week_date || 'Not set'}
                  </p>
                </div>

                <div className="score-week-item__actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEditClick(week)}
                  >
                    Edit
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