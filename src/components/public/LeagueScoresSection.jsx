import { useEffect, useState } from 'react';
import { getPublicLeaguesWithScores } from '../../services/supabase/publicScores';
import { formatScoreLine } from '../../utils/formatScoreLine';

export default function LeagueScoresSection() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadLeagueScores() {
      try {
        setLoading(true);
        const data = await getPublicLeaguesWithScores();
        setLeagues(data);
      } catch (error) {
        setErrorMessage(`Unable to load league scores: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadLeagueScores();
  }, []);

  return (
    <section className="league-scores-section">
      <div className="league-scores-section__inner">
        <h2>League Scores</h2>

        {loading ? (
          <p>Loading league scores...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : leagues.length === 0 ? (
          <p>No active leagues found.</p>
        ) : (
          <div className="league-scores-section__grid">
            {leagues.map((league) => (
              <article className="league-score-card" key={league.id}>
                <div className="league-score-card__header">
                  <h3>{league.name}</h3>
                  {league.day_of_week && <p>{league.day_of_week}</p>}
                </div>

                {!league.latestWeek ? (
                  <p>No weekly scores posted yet.</p>
                ) : (
                  <>
                    <div className="league-score-card__week">
                      <p>{league.latestWeek.week_label}</p>
                      {league.latestWeek.week_date && (
                        <small>{league.latestWeek.week_date}</small>
                      )}
                    </div>

                    {league.playerScores.length === 0 ? (
                      <p>No player scores posted yet.</p>
                    ) : (
                      <div className="league-score-card__scores">
                        {league.playerScores.map((score) => (
                          <p key={score.id}>{formatScoreLine(score)}</p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}