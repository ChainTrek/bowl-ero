import { useEffect, useState } from 'react'
import { getPublicTournaments } from '../../services/supabase/publicTournaments'
import { formatDisplayDate } from '../../utils/formatDisplayDate'

export default function TournamentsSection() {
	const [tournaments, setTournaments] = useState([])
	const [loading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		async function loadTournaments() {
			try {
				setLoading(true)
				const data = await getPublicTournaments()
				setTournaments(data)
			} catch (error) {
				setErrorMessage(`Unable to load tournaments: ${error.message}`)
			} finally {
				setLoading(false)
			}
		}

		loadTournaments()
	}, [])

	return (
		<section className='tournaments-section public-section public-section--dark'>
			<div className='tournaments-section__inner public-container'>
				<div className='public-section-header'>
					<span className='public-eyebrow'>Upcoming Events</span>
					<h2 className='public-heading'>Upcoming Tournaments</h2>
					<p className='public-subheading'>
						View upcoming tournament dates and registration details for tournaments at Bowl-Ero.
					</p>
				</div>

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
									<h3>{item.title}</h3>
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
			</div>
		</section>
	)
}
