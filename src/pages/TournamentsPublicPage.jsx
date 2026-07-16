import { useEffect, useState } from 'react'
import PublicPageShell from '../components/layout/PublicPageShell'
import PublicContentSection from '../components/layout/PublicContentSection'
import { getPublicTournaments } from '../services/supabase/publicTournaments'
import { formatDisplayDate } from '../utils/formatDisplayDate'

export default function TournamentsPublicPage() {
	const [tournaments, setTournaments] = useState([])
	const [loading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		async function loadTournaments() {
			try {
				setLoading(true)
				setErrorMessage('')

				const data = await getPublicTournaments()
				setTournaments(data ?? [])
			} catch (error) {
				setErrorMessage(error.message || 'Unable to load tournaments right now.')
			} finally {
				setLoading(false)
			}
		}

		loadTournaments()
	}, [])

	return (
		<PublicPageShell
			eyebrow='Events'
			title='Tournaments'
			description='Stay up to date with upcoming tournaments, event details, and registration information.'
		>
			<PublicContentSection sectionClassName='tournaments-section'>
				{loading ? (
					<p className='public-loading'>Loading tournaments...</p>
				) : errorMessage ? (
					<p className='public-error'>{errorMessage}</p>
				) : tournaments.length === 0 ? (
					<div className='tournaments-section__empty public-card'>
						<h2>No upcoming tournaments posted right now.</h2>
						<p>Please check back soon for new tournament dates and registration details.</p>
					</div>
				) : (
					<div className='tournaments-section__list'>
						{tournaments.map(item => (
							<article className='tournament-card' key={item.id}>
								<div className='tournament-card__content'>
									<h2>{item.title}</h2>

									<p className='tournament-card__date'>
										{formatDisplayDate(item.tournament_date)}
									</p>

									<p className='tournament-card__description'>
										{item.description?.trim()
											? item.description
											: 'More tournament details will be posted soon.'}
									</p>

									{item.registration_url ? (
										<a
											className='tournament-card__link'
											href={item.registration_url}
											target='_blank'
											rel='noreferrer'
										>
											Register Online
										</a>
									) : (
										<p className='tournament-card__registration-note'>
											Registration link coming soon.
										</p>
									)}
								</div>
							</article>
						))}
					</div>
				)}
			</PublicContentSection>
		</PublicPageShell>
	)
}