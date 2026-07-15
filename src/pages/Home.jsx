import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPublicTournaments } from '../services/supabase/publicTournaments'
import { getPublicLeaguesWithScores } from '../services/supabase/publicScores'
import { getPublicCafeMenuItems } from '../services/supabase/publicCafeMenu'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import { formatScoreLine } from '../utils/formatScoreLine'
import PublicNavbar from '../components/layout/PublicNavbar'
import PublicFooter from '../components/public/PublicFooter'
import AnnouncementsSection from '../components/public/AnnouncementsSection'
import bowleroLogo from '../assets/bowlero-logo.png'

export default function Home() {
	const [previewTournaments, setPreviewTournaments] = useState([])
	const [previewLeagues, setPreviewLeagues] = useState([])
	const [previewCafeItems, setPreviewCafeItems] = useState([])
	const [previewLoading, setPreviewLoading] = useState(true)

	useEffect(() => {
		async function loadPreviews() {
			try {
				setPreviewLoading(true)

				const [tournamentsData, leaguesData, cafeData] = await Promise.all([
					getPublicTournaments(),
					getPublicLeaguesWithScores(),
					getPublicCafeMenuItems(),
				])
				const cafeItems = cafeData ?? []
				const itemsWithImages = cafeItems.filter(item => item.image_url)

				setPreviewTournaments((tournamentsData ?? []).slice(0, 2))
				setPreviewLeagues((leaguesData ?? []).slice(0, 2))

				if (itemsWithImages.length > 0) {
					const randomIndex = Math.floor(Math.random() * itemsWithImages.length)
					setPreviewCafeItems([itemsWithImages[randomIndex]])
				} else if (cafeItems.length > 0) {
					const randomIndex = Math.floor(Math.random() * cafeItems.length)
					setPreviewCafeItems([cafeItems[randomIndex]])
				} else {
					setPreviewCafeItems([])
				}
			} catch (error) {
				console.error('Unable to load home previews:', error)
				setPreviewTournaments([])
				setPreviewLeagues([])
				setPreviewCafeItems([])
			} finally {
				setPreviewLoading(false)
			}
		}

		loadPreviews()
	}, [])

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
									Check announcements, tournaments, league scores, and cafe highlights all in
									one place.
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
								<h3>Upcoming tournament events</h3>

								{previewLoading ? (
									<p>Loading tournament preview...</p>
								) : previewTournaments.length === 0 ? (
									<p>No upcoming tournaments posted right now.</p>
								) : (
									<div className='home-preview-card__list'>
										{previewTournaments.map(item => (
											<div key={item.id} className='home-preview-card__item'>
												<strong>{item.title}</strong>
												<p>{formatDisplayDate(item.tournament_date)}</p>
												{item.description && (
													<p className='home-preview-card__meta'>
														{item.description.length > 90
															? `${item.description.slice(0, 90)}...`
															: item.description}
													</p>
												)}
											</div>
										))}
									</div>
								)}

								<Link to='/tournaments' className='primary-link-button'>
									View Full Tournaments
								</Link>
							</article>

							<article className='public-card home-preview-card'>
								<span className='home-preview-card__eyebrow'>League Scores</span>
								<h3>Recent league activity</h3>

								{previewLoading ? (
									<p>Loading league preview...</p>
								) : previewLeagues.length === 0 ? (
									<p>No active leagues found right now.</p>
								) : (
									<div className='home-preview-card__list'>
										{previewLeagues.map(league => (
											<div key={league.id} className='home-preview-card__item'>
												<strong>{league.name}</strong>

												<p className='home-preview-card__meta'>
													{league.latestWeek
														? `${league.latestWeek.week_label}${
																league.latestWeek.week_date
																	? ` • ${formatDisplayDate(league.latestWeek.week_date)}`
																	: ''
															}`
														: 'No scores posted yet'}
												</p>

												{league.playerScores?.length > 0 && (
													<div className='home-preview-card__score-list'>
														{league.playerScores.slice(0, 2).map(score => (
															<p key={score.id}>
																{formatScoreLine(score)}
															</p>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								)}

								<Link to='/league-scores' className='primary-link-button'>
									View Full League Scores
								</Link>
							</article>

							<article className='public-card home-preview-card'>
								<span className='home-preview-card__eyebrow'>Cafe</span>
								<h3>Featured menu highlight</h3>

								{previewLoading ? (
									<p>Loading cafe preview...</p>
								) : previewCafeItems.length === 0 ? (
									<p>No cafe items available right now.</p>
								) : (
									<div className='home-preview-card__feature'>
										{previewCafeItems[0].image_url && (
											<img
												src={previewCafeItems[0].image_url}
												alt={previewCafeItems[0].name}
												className='home-preview-card__image'
											/>
										)}

										<div className='home-preview-card__item'>
											<strong>{previewCafeItems[0].name}</strong>
											{previewCafeItems[0].description && (
												<p className='home-preview-card__meta'>
													{previewCafeItems[0].description.length > 110
														? `${previewCafeItems[0].description.slice(0, 110)}...`
														: previewCafeItems[0].description}
												</p>
											)}
										</div>
									</div>
								)}

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
