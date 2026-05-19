import { useEffect, useMemo, useState } from 'react';
import {
  getActiveLeagues,
  getLeagueWeeks,
  createLeagueWeek,
  updateLeagueWeek,
  getPlayerScoresByWeek,
  createPlayerScore,
  updatePlayerScore,
} from '../../services/supabase/scores';
import { formatScoreLine } from '../../utils/formatScoreLine';

const initialWeekForm = {
  league_id: '',
  week_label: '',
  week_date: '',
};

const initialScoreForm = {
  player_name: '',
  average: '',
  game1: '',
  game2: '',
  game3: '',
  series: '',
  display_order: 0,
};

function normalizeNumber(value) {
  return value === '' ? null : Number(value);
}

export default function ScoresPage() {
  const [leagues, setLeagues] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeekId, setSelectedWeekId] = useState(null);

  const [playerScores, setPlayerScores] = useState([]);

  const [weekFormData, setWeekFormData] = useState(initialWeekForm);
  const [editingWeekId, setEditingWeekId] = useState(null);

  const [scoreFormData, setScoreFormData] = useState(initialScoreForm);
  const [editingScoreId, setEditingScoreId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [submittingWeek, setSubmittingWeek] = useState(false);
  const [submittingScore, setSubmittingScore] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const selectedWeek = useMemo(
    () => weeks.find((week) => week.id === selectedWeekId) || null,
    [weeks, selectedWeekId]
  );

  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    if (selectedWeekId) {
      loadPlayerScores(selectedWeekId);
    } else {
      setPlayerScores([]);
    }
  }, [selectedWeekId]);

  async function loadPageData() {
    try {
      setLoading(true);

      const [leagueData, weekData] = await Promise.all([
        getActiveLeagues(),
        getLeagueWeeks(),
      ]);

      setLeagues(leagueData);
      setWeeks(weekData);

      if (weekData.length > 0) {
        setSelectedWeekId(weekData[0].id);
      }
    } catch (error) {
      setStatusMessage(`Error loading scores data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadPlayerScores(weekId) {
    try {
      setScoreLoading(true);
      const data = await getPlayerScoresByWeek(weekId);
      setPlayerScores(data);
    } catch (error) {
      setStatusMessage(`Error loading player scores: ${error.message}`);
    } finally {
      setScoreLoading(false);
    }
  }

  function handleWeekChange(event) {
    const { name, value } = event.target;

    setWeekFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleScoreChange(event) {
    const { name, value } = event.target;

    setScoreFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditWeekClick(week) {
    setEditingWeekId(week.id);
    setWeekFormData({
      league_id: String(week.league_id ?? ''),
      week_label: week.week_label || '',
      week_date: week.week_date || '',
    });
    setStatusMessage('');
  }

  function handleCancelWeekEdit() {
    setEditingWeekId(null);
    setWeekFormData(initialWeekForm);
    setStatusMessage('');
  }

  function handleSelectWeek(weekId) {
    setSelectedWeekId(weekId);
    setEditingScoreId(null);
    setScoreFormData(initialScoreForm);
    setStatusMessage('');
  }

  function handleEditScoreClick(score) {
    setEditingScoreId(score.id);
    setScoreFormData({
      player_name: score.player_name || '',
      average: score.average ?? '',
      game1: score.game1 ?? '',
      game2: score.game2 ?? '',
      game3: score.game3 ?? '',
      series: score.series ?? '',
      display_order: score.display_order ?? 0,
    });
    setStatusMessage('');
  }

  function handleCancelScoreEdit() {
    setEditingScoreId(null);
    setScoreFormData(initialScoreForm);
    setStatusMessage('');
  }

  async function handleWeekSubmit(event) {
    event.preventDefault();

    if (!weekFormData.league_id) {
      setStatusMessage('Please choose a league.');
      return;
    }

    if (!weekFormData.week_label.trim()) {
      setStatusMessage('Week label is required.');
      return;
    }

    try {
      setSubmittingWeek(true);
      setStatusMessage('');

      const payload = {
        league_id: Number(weekFormData.league_id),
        week_label: weekFormData.week_label.trim(),
        week_date: weekFormData.week_date || null,
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
        setSelectedWeekId(newWeek.id);
        setStatusMessage('Weekly entry created successfully.');
      }

      setWeekFormData(initialWeekForm);
      setEditingWeekId(null);
    } catch (error) {
      setStatusMessage(
        `Error ${editingWeekId ? 'updating' : 'creating'} weekly entry: ${error.message}`
      );
    } finally {
      setSubmittingWeek(false);
    }
  }

  async function handleScoreSubmit(event) {
    event.preventDefault();

    if (!selectedWeekId) {
      setStatusMessage('Please select a weekly entry first.');
      return;
    }

    if (!scoreFormData.player_name.trim()) {
      setStatusMessage('Player name is required.');
      return;
    }

    const average = normalizeNumber(scoreFormData.average);
    const game1 = normalizeNumber(scoreFormData.game1);
    const game2 = normalizeNumber(scoreFormData.game2);
    const game3 = normalizeNumber(scoreFormData.game3);
    const series = normalizeNumber(scoreFormData.series);
    const displayOrder = normalizeNumber(scoreFormData.display_order) ?? 0;

    const gamesEntered = [game1, game2, game3].filter(
      (game) => game !== null
    ).length;

    if (gamesEntered === 0) {
      setStatusMessage('Enter at least one game score.');
      return;
    }

    try {
      setSubmittingScore(true);
      setStatusMessage('');

      const payload = {
        league_week_id: selectedWeekId,
        player_name: scoreFormData.player_name.trim(),
        average,
        game1,
        game2,
        game3,
        series,
        display_order: displayOrder,
      };

      if (editingScoreId) {
        const updatedScore = await updatePlayerScore(editingScoreId, payload);

        setPlayerScores((prev) =>
          prev.map((score) => (score.id === editingScoreId ? updatedScore : score))
        );

        setStatusMessage('Player score updated successfully.');
      } else {
        const newScore = await createPlayerScore(payload);

        setPlayerScores((prev) => [...prev, newScore]);
        setStatusMessage('Player score added successfully.');
      }

      setScoreFormData(initialScoreForm);
      setEditingScoreId(null);
    } catch (error) {
      setStatusMessage(
        `Error ${editingScoreId ? 'updating' : 'adding'} player score: ${error.message}`
      );
    } finally {
      setSubmittingScore(false);
    }
  }

  const livePreview = formatScoreLine({
    player_name: scoreFormData.player_name,
    average: scoreFormData.average,
    game1: scoreFormData.game1,
    game2: scoreFormData.game2,
    game3: scoreFormData.game3,
    series: scoreFormData.series,
  });

  return (
    <section className="admin-page scores-page">
      <div className="admin-page__header">
        <h1>Weekly Scores</h1>
        <p>Create weekly league entries and add player score lines.</p>
      </div>

      <div className="admin-card">
        <h2>{editingWeekId ? 'Edit Weekly Entry' : 'Create Weekly Entry'}</h2>

        <form className="score-week-form" onSubmit={handleWeekSubmit}>
          <div className="form-group">
            <label htmlFor="league_id">League</label>
            <select
              id="league_id"
              name="league_id"
              value={weekFormData.league_id}
              onChange={handleWeekChange}
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
              value={weekFormData.week_label}
              onChange={handleWeekChange}
              placeholder="Example: April 27, 2026"
            />
          </div>

          <div className="form-group">
            <label htmlFor="week_date">Week Date</label>
            <input
              id="week_date"
              name="week_date"
              type="date"
              value={weekFormData.week_date}
              onChange={handleWeekChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submittingWeek}>
              {submittingWeek
                ? 'Saving...'
                : editingWeekId
                ? 'Update Weekly Entry'
                : 'Create Weekly Entry'}
            </button>

            {editingWeekId && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancelWeekEdit}
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
              <article
                className={`score-week-item ${
                  selectedWeekId === week.id ? 'score-week-item--selected' : ''
                }`}
                key={week.id}
              >
                <div className="score-week-item__info">
                  <h3>{week.week_label}</h3>
                  <p>
                    League: {week.leagues?.name || 'Unknown league'}
                    {week.leagues?.day_of_week ? ` (${week.leagues.day_of_week})` : ''}
                  </p>
                  <p>Week Date: {week.week_date || 'Not set'}</p>
                </div>

                <div className="score-week-item__actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleSelectWeek(week.id)}
                  >
                    {selectedWeekId === week.id ? 'Selected' : 'Select'}
                  </button>

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEditWeekClick(week)}
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h2>
          {editingScoreId ? 'Edit Player Score' : 'Add Player Score'}
          {selectedWeek ? ` — ${selectedWeek.week_label}` : ''}
        </h2>

        {!selectedWeek ? (
          <p>Select a weekly entry above to add score rows.</p>
        ) : (
          <>
            <form className="player-score-form" onSubmit={handleScoreSubmit}>
              <div className="form-group">
                <label htmlFor="player_name">Player Name</label>
                <input
                  id="player_name"
                  name="player_name"
                  type="text"
                  value={scoreFormData.player_name}
                  onChange={handleScoreChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="average">Average</label>
                <input
                  id="average"
                  name="average"
                  type="number"
                  min="0"
                  max="300"
                  value={scoreFormData.average}
                  onChange={handleScoreChange}
                />
              </div>

              <div className="score-grid">
                <div className="form-group">
                  <label htmlFor="game1">Game 1</label>
                  <input
                    id="game1"
                    name="game1"
                    type="number"
                    min="0"
                    max="300"
                    value={scoreFormData.game1}
                    onChange={handleScoreChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="game2">Game 2</label>
                  <input
                    id="game2"
                    name="game2"
                    type="number"
                    min="0"
                    max="300"
                    value={scoreFormData.game2}
                    onChange={handleScoreChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="game3">Game 3</label>
                  <input
                    id="game3"
                    name="game3"
                    type="number"
                    min="0"
                    max="300"
                    value={scoreFormData.game3}
                    onChange={handleScoreChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="series">Series</label>
                  <input
                    id="series"
                    name="series"
                    type="number"
                    min="0"
                    max="900"
                    value={scoreFormData.series}
                    onChange={handleScoreChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="display_order">Display Order</label>
                  <input
                    id="display_order"
                    name="display_order"
                    type="number"
                    min="0"
                    value={scoreFormData.display_order}
                    onChange={handleScoreChange}
                  />
                </div>
              </div>

              <div className="score-preview">
                <h3>Preview</h3>
                <p>{livePreview}</p>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={submittingScore}>
                  {submittingScore
                    ? 'Saving...'
                    : editingScoreId
                    ? 'Update Player Score'
                    : 'Add Player Score'}
                </button>

                {editingScoreId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleCancelScoreEdit}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="player-score-list-wrapper">
              <h3>Current Player Scores</h3>

              {scoreLoading ? (
                <p>Loading player scores...</p>
              ) : playerScores.length === 0 ? (
                <p>No player scores added yet.</p>
              ) : (
                <div className="player-score-list">
                  {playerScores.map((score) => (
                    <article className="player-score-item" key={score.id}>
                      <div className="player-score-item__info">
                        <p>{formatScoreLine(score)}</p>
                      </div>

                      <div className="player-score-item__actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => handleEditScoreClick(score)}
                        >
                          Edit
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}