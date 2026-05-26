import { Link } from 'react-router-dom'
import bowleroLogo from '../assets/bowlero-logo.png'
import HoursSection from '../components/public/HoursSection'
import AnnouncementsSection from '../components/public/AnnouncementsSection'
import LeagueScoresSection from '../components/public/LeagueScoresSection'
import TournamentsSection from '../components/public/TournamentsSection'
import CafeMenuSection from '../components/public/CafeMenuSection'

export default function Home() {
	return (
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
							<img className='site-logo site-logo--hero' src={bowleroLogo} alt='Bowlero logo' />
						</Link>

						<div className='hero-section__text'>
							<h1 className='public-heading public-heading--hero'>
								Bowling, food, leagues, and events with a more modern feel.
							</h1>

							<p className='public-subheading public-subheading--hero'>
								Check announcements, tournaments, league scores, and cafe menu boards all in one
								place.
							</p>
						</div>
					</div>
				</div>
			</section>

			<AnnouncementsSection />
      <TournamentsSection />
			<LeagueScoresSection />
			<CafeMenuSection />
			<HoursSection />
		</main>
	)
}
