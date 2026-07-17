import { useEffect, useState } from 'react'
import PublicPageShell from '../components/layout/PublicPageShell'
import PublicContentSection from '../components/layout/PublicContentSection'
import { getPublicLeaguesWithScores } from '../services/supabase/publicScores'
import { formatScoreLine } from '../utils/formatScoreLine'
import { formatDisplayDate } from '../utils/formatDisplayDate'

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
		<PublicPageShell
			eyebrow='Competition'
			title='League Scores'
			description='Check current weekly league scores and keep up with standings and performance.'
		>
			<PublicContentSection
				sectionClassName='league-scores-section'
				containerClassName='league-scores-section__inner'
			>
				{loading ? (
					<p className='public-loading'>Loading league scores...</p>
				) : errorMessage ? (
					<p className='public-error'>{errorMessage}</p>
				) : leagues.length === 0 ? (
					<div className='league-scores-section__empty public-card'>
						<h2>No league scores are available right now.</h2>
						<p>Please check back soon for the latest weekly score updates.</p>
					</div>
				) : (
					<div className='league-scores-section__grid'>
						{leagues.map(league => (
							<article className='league-score-card' key={league.id}>
								<div className='league-score-card__header'>
									<h2>{league.name}</h2>
									{league.day_of_week && <p>{league.day_of_week}</p>}
								</div>

								{!league.latestWeek ? (
									<div className='league-score-card__empty-state'>
										<p>Scores for this league will be posted soon.</p>
									</div>
								) : (
									<>
										<div className='league-score-card__week'>
											<span className='league-score-card__week-label'>
												Latest Week
											</span>
											<p>{league.latestWeek.week_label}</p>
											{league.latestWeek.week_date && (
												<small>
													{formatDisplayDate(league.latestWeek.week_date)}
												</small>
											)}
										</div>

										{league.playerScores.length === 0 ? (
											<div className='league-score-card__empty-state'>
												<p>No player scores have been posted for this week yet.</p>
											</div>
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
			</PublicContentSection>
		</PublicPageShell>
	)
}
