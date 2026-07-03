import { Link } from 'react-router-dom'
import PublicNavbar from '../components/layout/PublicNavbar'
import PublicFooter from '../components/public/PublicFooter'
import AnnouncementsSection from '../components/public/AnnouncementsSection'
import bowleroLogo from '../assets/bowlero-logo.png'

export default function Home() {
  return (
    <>
      <PublicNavbar />

      <main className='home-page public-page'>
        <section className='hero-section public-section public-section--tight'>
          <div className='public-container hero-section__content'>
            <span className='public-eyebrow'>Bowl-Ero Lanes</span>

            <div className='hero-section__main'>
              <Link
                to='/'
                className='site-logo-link hero-section__logo-link'
                aria-label='Go to home page'
              >
                <img
                  className='site-logo site-logo--hero'
                  src={bowleroLogo}
                  alt='Bowlero logo'
                />
              </Link>

              <div className='hero-section__text'>
                <h1 className='public-heading public-heading--hero'>
                  Bowling, food, leagues, and events with a more modern feel.
                </h1>

                <p className='public-subheading public-subheading--hero'>
                  Check announcements, tournaments, league scores, and cafe highlights all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        <AnnouncementsSection />

        <section className='public-section home-preview-section'>
          <div className='public-container'>
            <div className='public-section-header'>
              <span className='public-eyebrow'>Explore</span>
              <h2 className='public-heading'>Quick Access</h2>
              <p className='public-subheading'>
                Jump into tournaments, league scores, and the cafe menu from the home page.
              </p>
            </div>

            <div className='home-preview-grid'>
              <article className='public-card home-preview-card'>
                <span className='home-preview-card__eyebrow'>Tournaments</span>
                <h3>Tournament information and upcoming events</h3>
                <p>
                  View upcoming tournament dates and details in one dedicated page.
                </p>
                <Link to='/tournaments' className='primary-link-button'>
                  View Full Tournaments
                </Link>
              </article>

              <article className='public-card home-preview-card'>
                <span className='home-preview-card__eyebrow'>League Scores</span>
                <h3>Weekly scores and standings</h3>
                <p>
                  Check the latest posted scores and follow league progress more easily.
                </p>
                <Link to='/league-scores' className='primary-link-button'>
                  View Full League Scores
                </Link>
              </article>

              <article className='public-card home-preview-card'>
                <span className='home-preview-card__eyebrow'>Cafe</span>
                <h3>Menu boards and food offerings</h3>
                <p>
                  Browse the cafe page for the full menu images and current offerings.
                </p>
                <Link to='/cafe' className='primary-link-button'>
                  View Full Cafe Menu
                </Link>
              </article>
            </div>
          </div>
        </section>

        <PublicFooter />
      </main>
    </>
  )
}