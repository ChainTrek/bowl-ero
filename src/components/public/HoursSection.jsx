import { useEffect, useState } from 'react'
import { getPublicHours } from '../../services/supabase/publicHours'
import { formatHoursTime } from '../../utils/formatHoursTime'

export default function HoursSection() {
	const [hours, setHours] = useState([])
	const [loading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		async function loadHours() {
			try {
				setLoading(true)
				const data = await getPublicHours()
				setHours(data)
			} catch (error) {
				setErrorMessage(`Unable to load hours: ${error.message}`)
			} finally {
				setLoading(false)
			}
		}

		loadHours()
	}, [])

	return (
		<section className="hours-section public-section public-section--tight public-section--accent">
			<div className='hours-section__inner public-container public-card'>
				<div className='public-section-header'>
					<span className='public-eyebrow'>Plan Your Visit</span>
					<h2 className='public-heading'>Hours of Operation</h2>
					<p className='public-subheading'>
						Check the current business hours before you plan your visit.
					</p>
				</div>

				{loading ? (
					<p className='public-loading'>Loading hours...</p>
				) : errorMessage ? (
					<p className='public-error'>{errorMessage}</p>
				) : (
					<div className='hours-section__list'>
						{hours.map(row => (
							<div className='hours-section__item' key={row.id}>
								<span className='hours-section__day'>{row.day_of_week}</span>

								<span className='hours-section__time'>
									{row.is_closed
										? 'Closed'
										: `${formatHoursTime(row.open_time)} - ${formatHoursTime(row.close_time)}`}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
