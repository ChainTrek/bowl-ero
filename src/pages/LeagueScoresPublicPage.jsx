import { useEffect, useState } from 'react'
import { getPublicLeaguesWithScores } from '../services/supabase/publicScores'
import { formatScoreLine } from '../utils/formatScoreLine'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import PublicNavbar from '../components/layout/PublicNavbar'
import PublicFooter from '../components/public/PublicFooter'

export default function LeagueScoresPublicPage() {
	const [leagues, setLeagues] = useState([])
	const [loading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		async function loadLeagueScores() {
			try {
				setLoading(true)
				setErrorMessage('')

				const data = await getPublicLeaguesWithScores()
				setLeagues(data ?? [])
			} catch (error) {
				setErrorMessage(`Unable to load league scores: ${error.message}`)
			} finally {
				setLoading(false)
			}
		}

		loadLeagueScores()
	}, [])

	return (
		<>
			<PublicNavbar />

			<main className='public-page public-destination-page'>
				<section className='public-section public-section--tight public-destination-hero'>
					<div className='public-container'>
						<div className='public-section-header'>
							<span className='public-eyebrow'>Competition</span>
							<h1 className='public-heading'>League Scores</h1>
							<p className='public-subheading'>
								Check current weekly league scores and keep up with standings and performance.
							</p>
						</div>
					</div>
				</section>

				<section className='public-section league-scores-section'>
					<div className='league-scores-section__inner public-container'>
						{loading ? (
							<p className='public-loading'>Loading league scores...</p>
						) : errorMessage ? (
							<p className='public-error'>{errorMessage}</p>
						) : leagues.length === 0 ? (
							<p className='public-empty'>No active leagues found.</p>
						) : (
							<div className='league-scores-section__grid'>
								{leagues.map(league => (
									<article className='league-score-card' key={league.id}>
										<div className='league-score-card__header'>
											<h2>{league.name}</h2>
											{league.day_of_week && <p>{league.day_of_week}</p>}
										</div>

										{!league.latestWeek ? (
											<p>No weekly scores posted yet.</p>
										) : (
											<>
												<div className='league-score-card__week'>
													<p>{league.latestWeek.week_label}</p>
													{league.latestWeek.week_date && (
														<small>
															{formatDisplayDate(league.latestWeek.week_date)}
														</small>
													)}
												</div>

												{league.playerScores.length === 0 ? (
													<p>No player scores posted yet.</p>
												) : (
													<div className='league-score-card__scores'>
														{league.playerScores.map(score => (
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

				<PublicFooter />
			</main>
		</>
	)
}