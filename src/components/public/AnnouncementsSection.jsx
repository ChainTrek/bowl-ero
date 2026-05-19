import { useEffect, useState } from 'react';
import { getPublicAnnouncements } from '../../services/supabase/publicAnnouncements';

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        const data = await getPublicAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        setErrorMessage(`Unable to load announcements: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadAnnouncements();
  }, []);

  return (
    <section className="announcements-section">
      <div className="announcements-section__inner">
        <h2>Announcements</h2>

        {loading ? (
          <p>Loading announcements...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : announcements.length === 0 ? (
          <p>No current announcements.</p>
        ) : (
          <div className="announcements-section__grid">
            {announcements.map((item) => (
              <article className="announcement-card" key={item.id}>
                {item.image_url && (
                  <img
                    className="announcement-card__image"
                    src={item.image_url}
                    alt={item.title}
                  />
                )}

                <div className="announcement-card__content">
                  <h3>{item.title}</h3>

                  {item.description && <p>{item.description}</p>}

                  {item.link_url && (
                    <a
                      className="announcement-card__link"
                      href={item.link_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Register / Learn More
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}