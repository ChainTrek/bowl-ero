import { useEffect, useState } from 'react';
import { getPublicHours } from '../../services/supabase/publicHours';

export default function HoursSection() {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadHours() {
      try {
        setLoading(true);
        const data = await getPublicHours();
        setHours(data);
      } catch (error) {
        setErrorMessage(`Unable to load hours: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadHours();
  }, []);

  return (
    <section className="hours-section">
      <div className="hours-section__inner">
        <h2>Hours of Operation</h2>

        {loading ? (
          <p>Loading hours...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <div className="hours-section__list">
            {hours.map((row) => (
              <div className="hours-section__item" key={row.id}>
                <span className="hours-section__day">{row.day_of_week}</span>

                <span className="hours-section__time">
                  {row.is_closed
                    ? 'Closed'
                    : `${row.open_time || 'Open'} - ${row.close_time || 'Close'}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}