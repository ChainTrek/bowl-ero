import { useEffect, useState, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getPublicAnnouncements } from '../../services/supabase/publicAnnouncements';

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplay = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: announcements.length > 1,
      align: 'start',
    },
    announcements.length > 1 ? [autoplay.current] : []
  );

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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  function handlePrev() {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }

  function handleNext() {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }

  function handleDotClick(index) {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }

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
          <div className="announcement-carousel">
            <div className="announcement-carousel__viewport" ref={emblaRef}>
              <div className="announcement-carousel__container">
                {announcements.map((item) => (
                  <div className="announcement-carousel__slide" key={item.id}>
                    <article className="announcement-slide-card">
                      {item.image_url && (
                        <img
                          className="announcement-slide-card__image"
                          src={item.image_url}
                          alt={item.title}
                        />
                      )}

                      <div className="announcement-slide-card__details">
                        <h3>{item.title}</h3>

                        {item.description && <p>{item.description}</p>}

                        {item.link_url && (
                          <a
                            className="announcement-slide-card__link"
                            href={item.link_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Register / Learn More
                          </a>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            {announcements.length > 1 && (
              <div className="announcement-carousel__controls">
                <button
                  type="button"
                  className="announcement-carousel__button"
                  onClick={handlePrev}
                >
                  Previous
                </button>

                <div className="announcement-carousel__dots">
                  {announcements.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`announcement-carousel__dot ${
                        index === selectedIndex
                          ? 'announcement-carousel__dot--active'
                          : ''
                      }`}
                      onClick={() => handleDotClick(index)}
                      aria-label={`Go to announcement ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="announcement-carousel__button"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}