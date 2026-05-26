import { useEffect, useState, useCallback, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { getPublicCafeMenuItems } from '../../services/supabase/publicCafeMenu'

export default function CafeMenuSection() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(0)

	const autoplay = useRef(
		Autoplay({
			delay: 5000,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
			stopOnFocusIn: true,
		}),
	)

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: items.length > 1,
			align: 'start',
		},
		items.length > 1 ? [autoplay.current] : [],
	)

	useEffect(() => {
		async function loadMenuItems() {
			try {
				setLoading(true)
				const data = await getPublicCafeMenuItems()
				setItems(data)
			} catch (error) {
				setErrorMessage(`Unable to load cafe menu: ${error.message}`)
			} finally {
				setLoading(false)
			}
		}

		loadMenuItems()
	}, [])

	const onSelect = useCallback(() => {
		if (!emblaApi) return
		setSelectedIndex(emblaApi.selectedScrollSnap())
	}, [emblaApi])

	useEffect(() => {
		if (!emblaApi) return

		onSelect()
		emblaApi.on('select', onSelect)
		emblaApi.on('reInit', onSelect)

		return () => {
			emblaApi.off('select', onSelect)
			emblaApi.off('reInit', onSelect)
		}
	}, [emblaApi, onSelect])

	function handlePrev() {
		if (!emblaApi) return
		emblaApi.scrollPrev()
	}

	function handleNext() {
		if (!emblaApi) return
		emblaApi.scrollNext()
	}

	function handleDotClick(index) {
		if (!emblaApi) return
		emblaApi.scrollTo(index)
	}

	return (
		<section className='cafe-menu-section public-section'>
			<div className='cafe-menu-section__inner public-container'>
				<div className="public-section-header">
					<span className="public-eyebrow">Food & Drinks</span>
					<h2 className='public-heading'>Cafe Menu</h2>
					<p className="public-subheading">
						Browse featured menu boards from the cafe carousel.
					</p>
				</div>

				{loading ? (
					<p className='public-loading'>Loading menu...</p>
				) : errorMessage ? (
					<p className='public-error'>{errorMessage}</p>
				) : items.length === 0 ? (
					<p className='public-empty'>No menu items available right now.</p>
				) : (
					<div className='cafe-carousel'>
						<div className='cafe-carousel__viewport' ref={emblaRef}>
							<div className='cafe-carousel__container'>
								{items.map(item => (
									<div className='cafe-carousel__slide' key={item.id}>
										<article className='cafe-slide-card'>
											{item.image_url && (
												<div className='cafe-slide-card__image-wrapper'>
													<img
														className='cafe-slide-card__image'
														src={item.image_url}
														alt={item.name}
													/>
												</div>
											)}

											<div className='cafe-slide-card__details'>
												<h3>{item.name}</h3>
												{item.description && <p>{item.description}</p>}
											</div>
										</article>
									</div>
								))}
							</div>
						</div>

						{items.length > 1 && (
							<div className='cafe-carousel__controls'>
								<button type='button' className='cafe-carousel__button' onClick={handlePrev}>
									Previous
								</button>

								<div className='cafe-carousel__dots'>
									{items.map((item, index) => (
										<button
											key={item.id}
											type='button'
											className={`cafe-carousel__dot ${
												index === selectedIndex ? 'cafe-carousel__dot--active' : ''
											}`}
											onClick={() => handleDotClick(index)}
											aria-label={`Go to cafe item ${index + 1}`}
										/>
									))}
								</div>

								<button type='button' className='cafe-carousel__button' onClick={handleNext}>
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
