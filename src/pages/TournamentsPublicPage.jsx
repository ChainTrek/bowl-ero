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
			<PublicContentSection sectionClassName='tournaments-section' containerClassName='tournaments-section__inner'>
				{loading ? (
					<p className='public-loading'>Loading tournaments...</p>
				) : errorMessage ? (
					<p className='public-error'>{errorMessage}</p>
				) : tournaments.length === 0 ? (
					<p className='public-empty'>No upcoming tournaments posted right now.</p>
				) : (
					<div className='tournaments-section__list'>
						{tournaments.map(item => (
							<article className='tournament-card' key={item.id}>
								<div className='tournament-card__content'>
									<h2>{item.title}</h2>
									<p>{formatDisplayDate(item.tournament_date)}</p>
									{item.description && <p>{item.description}</p>}
									{item.registration_url && (
										<a
											className='tournament-card__link'
											href={item.registration_url}
											target='_blank'
											rel='noreferrer'
										>
											Register Online
										</a>
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