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
												<small>{formatDisplayDate(league.latestWeek.week_date)}</small>
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
			</PublicContentSection>
		</PublicPageShell>
	)
}