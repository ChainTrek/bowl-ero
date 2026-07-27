import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { getPublicAnnouncements } from '../../services/supabase/publicAnnouncements'

export default function AnnouncementsSection() {
	const [announcements, setAnnouncements] = useState([])
	const [loading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(0)

	const autoplayPlugin = useMemo(
		() =>
			Autoplay({
				delay: 5000,
				stopOnInteraction: false,
				stopOnMouseEnter: true,
				stopOnFocusIn: true,
			}),
		[],
	)

	const carouselPlugins = useMemo(
		() => (announcements.length > 1 ? [autoplayPlugin] : []),
		[announcements.length, autoplayPlugin],
	)

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: announcements.length > 1,
			align: 'start',
		},
		carouselPlugins,
	)

	useEffect(() => {
		async function loadAnnouncements() {
			try {
				setLoading(true)
				setErrorMessage('')

				const data = await getPublicAnnouncements()
				setAnnouncements(data ?? [])
			} catch (error) {
				setErrorMessage(
					`Unable to load announcements: ${error.message}`,
				)
			} finally {
				setLoading(false)
			}
		}

		loadAnnouncements()
	}, [])

	const handleCarouselSelect = useCallback(() => {
		if (!emblaApi) {
			return
		}

		setSelectedIndex(emblaApi.selectedScrollSnap())
	}, [emblaApi])

	useEffect(() => {
		if (!emblaApi) {
			return undefined
		}

		const animationFrameId = window.requestAnimationFrame(
			handleCarouselSelect,
		)

		emblaApi.on('select', handleCarouselSelect)
		emblaApi.on('reInit', handleCarouselSelect)

		return () => {
			window.cancelAnimationFrame(animationFrameId)
			emblaApi.off('select', handleCarouselSelect)
			emblaApi.off('reInit', handleCarouselSelect)
		}
	}, [emblaApi, handleCarouselSelect])

	function handlePrevious() {
		emblaApi?.scrollPrev()
	}

	function handleNext() {
		emblaApi?.scrollNext()
	}

	function handleDotClick(index) {
		emblaApi?.scrollTo(index)
	}

	return (
		<section className='announcements-section public-section public-section--accent'>
			<div className='announcements-section__inner public-container'>
				<div className='public-section-header'>
					<span className='public-eyebrow'>Featured</span>

					<h2 className='public-heading'>
						Announcements
					</h2>

					<p className='public-subheading'>
						Stay up to date with specials, signups, and
						important events happening at Bowl-Ero.
					</p>
				</div>

				{loading ? (
					<p className='public-loading'>
						Loading announcements...
					</p>
				) : errorMessage ? (
					<p className='public-error'>{errorMessage}</p>
				) : announcements.length === 0 ? (
					<p className='public-empty'>
						No current announcements.
					</p>
				) : (
					<div className='announcement-carousel'>
						<div
							className='announcement-carousel__viewport'
							ref={emblaRef}
						>
							<div className='announcement-carousel__container'>
								{announcements.map(item => (
									<div
										className='announcement-carousel__slide'
										key={item.id}
									>
										<article className='announcement-slide-card'>
											{item.image_url && (
												<div className='announcement-slide-card__image-wrapper'>
													<img
														className='announcement-slide-card__image'
														src={
															item.image_url
														}
														alt={
															item.title
														}
													/>
												</div>
											)}

											<div className='announcement-slide-card__details'>
												<h3>
													{item.title}
												</h3>

												{item.description && (
													<p>
														{
															item.description
														}
													</p>
												)}

												{item.link_url && (
													<a
														className='announcement-slide-card__link'
														href={
															item.link_url
														}
														target='_blank'
														rel='noreferrer'
													>
														Register /
														Learn More
													</a>
												)}
											</div>
										</article>
									</div>
								))}
							</div>
						</div>

						{announcements.length > 1 && (
							<div className='announcement-carousel__controls'>
								<button
									type='button'
									className='announcement-carousel__button'
									onClick={handlePrevious}
									aria-label='Show previous announcement'
								>
									Previous
								</button>

								<div className='announcement-carousel__dots'>
									{announcements.map(
										(item, index) => (
											<button
												key={item.id}
												type='button'
												className={`announcement-carousel__dot ${
													index ===
													selectedIndex
														? 'announcement-carousel__dot--active'
														: ''
												}`}
												onClick={() =>
													handleDotClick(
														index,
													)
												}
												aria-label={`Go to announcement ${
													index + 1
												}`}
												aria-current={
													index ===
													selectedIndex
														? 'true'
														: undefined
												}
											/>
										),
									)}
								</div>

								<button
									type='button'
									className='announcement-carousel__button'
									onClick={handleNext}
									aria-label='Show next announcement'
								>
									Next
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	)
}