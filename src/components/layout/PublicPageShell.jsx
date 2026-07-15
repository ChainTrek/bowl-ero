import PublicNavbar from './PublicNavbar'
import PublicFooter from '../public/PublicFooter'

export default function PublicPageShell({
	eyebrow,
	title,
	description,
	children,
	mainClassName = '',
}) {
	const mainClass = ['public-page', 'public-destination-page', mainClassName]
		.filter(Boolean)
		.join(' ')

	return (
		<>
			<PublicNavbar />

			<main className={mainClass}>
				<section className='public-section public-section--tight public-destination-hero'>
					<div className='public-container'>
						<div className='public-section-header'>
							{eyebrow && <span className='public-eyebrow'>{eyebrow}</span>}
							{title && <h1 className='public-heading'>{title}</h1>}
							{description && <p className='public-subheading'>{description}</p>}
						</div>
					</div>
				</section>

				{children}

				<PublicFooter />
			</main>
		</>
	)
}