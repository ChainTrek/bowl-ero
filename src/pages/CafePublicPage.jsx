import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import PublicPageShell from '../components/layout/PublicPageShell'
import PublicContentSection from '../components/layout/PublicContentSection'
import { getPublicCafeMenuItems } from '../services/supabase/publicCafeMenu'

export default function CafePublicPage() {
	const [items, setItems] = useState([])
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
		() => (items.length > 1 ? [autoplayPlugin] : []),
		[autoplayPlugin, items.length],
	)

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: items.length > 1,
			align: 'start',
		},
		carouselPlugins,
	)

	useEffect(() => {
		async function loadMenuItems() {
			try {
				setLoading(true)
				setErrorMessage('')

				const data = await getPublicCafeMenuItems()
				setItems(data ?? [])
			} catch (error) {
				setErrorMessage(
					`Unable to load cafe menu: ${error.message}`,
				)
			} finally {
				setLoading(false)
			}
		}

		loadMenuItems()
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
		<PublicPageShell
			eyebrow='Food & Drinks'
			title='Cafe Menu'
			description='Browse the cafe menu boards and see the current food and drink offerings.'
		>
			<PublicContentSection
				sectionClassName='cafe-menu-section'
				containerClassName='cafe-menu-section__inner'
			>
				{loading ? (
					<p className='public-loading'>
						Loading menu...
					</p>
				) : errorMessage ? (
					<p className='public-error'>{errorMessage}</p>
				) : items.length === 0 ? (
					<div className='cafe-menu-section__empty public-card'>
						<h2>
							No cafe menu is available right now.
						</h2>

						<p>
							Please check back soon for updated menu
							boards and current offerings.
						</p>
					</div>
				) : (
					<div className='cafe-carousel'>
						<div
							className='cafe-carousel__viewport'
							ref={emblaRef}
						>
							<div className='cafe-carousel__container'>
								{items.map(item => (
									<div
										className='cafe-carousel__slide'
										key={item.id}
									>
										<article className='cafe-slide-card'>
											{item.image_url && (
												<div className='cafe-slide-card__image-wrapper'>
													<img
														className='cafe-slide-card__image'
														src={
															item.image_url
														}
														alt={
															item.name
														}
													/>
												</div>
											)}

											<div className='cafe-slide-card__details'>
												<span className='cafe-slide-card__eyebrow'>
													Menu Board
												</span>

												<h2>{item.name}</h2>

												<p className='cafe-slide-card__description'>
													{item.description?.trim()
														? item.description
														: 'Current menu board on display.'}
												</p>
											</div>
										</article>
									</div>
								))}
							</div>
						</div>

						{items.length > 1 && (
							<div className='cafe-carousel__controls'>
								<button
									type='button'
									className='cafe-carousel__button'
									onClick={handlePrevious}
									aria-label='Show previous cafe menu item'
								>
									Previous
								</button>

								<div className='cafe-carousel__dots'>
									{items.map((item, index) => (
										<button
											key={item.id}
											type='button'
											className={`cafe-carousel__dot ${
												index ===
												selectedIndex
													? 'cafe-carousel__dot--active'
													: ''
											}`}
											onClick={() =>
												handleDotClick(index)
											}
											aria-label={`Go to cafe item ${
												index + 1
											}`}
											aria-current={
												index ===
												selectedIndex
													? 'true'
													: undefined
											}
										/>
									))}
								</div>

								<button
									type='button'
									className='cafe-carousel__button'
									onClick={handleNext}
									aria-label='Show next cafe menu item'
								>
									Next
								</button>
							</div>
						)}
					</div>
				)}
			</PublicContentSection>
		</PublicPageShell>
	)
}