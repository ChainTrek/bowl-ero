import { Link } from 'react-router-dom'
import bowleroLogo from '../../assets/bowlero-logo.png'
import HoursSection from './HoursSection'

export default function PublicFooter() {
	function handleBackToTop(event) {
		event.preventDefault()
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<footer className='public-footer' id='footer'>
			<div className='public-container public-footer__inner'>
				<div className='public-footer__brand'>
					<Link to='/' className='site-logo-link' aria-label='Go to home page'>
						<img
							className='site-logo site-logo--footer'
							src={bowleroLogo}
							alt='Bowlero logo'
						/>
					</Link>
				</div>

				<div className='public-footer__content'>
					<section className='public-footer__nav' aria-label='Footer navigation'>
						<div className='public-section-header public-footer__section-header'>
							<span className='public-eyebrow'>Quick Links</span>
							<h2 className='public-heading'>Explore</h2>
							<p className='public-subheading'>
								Browse the main public pages around the Bowl-Ero site.
							</p>
						</div>

						<div className='public-footer__links'>
							<Link to='/'>Home</Link>
							<Link to='/tournaments'>Tournaments</Link>
							<Link to='/league-scores'>League Scores</Link>
							<Link to='/cafe'>Cafe</Link>
							<Link to='/contact'>Contact Us</Link>
							<Link to='/employment'>Employment</Link>
						</div>
					</section>

					<section className='public-footer__facebook' aria-label='Facebook feed'>
						<div className='public-section-header public-footer__section-header'>
							<span className='public-eyebrow'>Social</span>
							<h2 className='public-heading'>Facebook</h2>
							<p className='public-subheading'>
								Follow Bowl-Ero updates, promotions, and announcements.
							</p>
						</div>

						<div className='public-footer__facebook-embed'>
							<iframe
								title='Bowl-Ero Lanes Facebook Feed'
								src='https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fbowerolanesidahofalls&tabs=timeline&width=500&height=420&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true'
								width='500'
								height='420'
								style={{ border: 'none', overflow: 'hidden' }}
								scrolling='no'
								frameBorder='0'
								allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
							/>
						</div>
					</section>

					<div className='public-footer__hours'>
						<HoursSection isFooter />
					</div>
				</div>

				<div className='public-footer__bottom'>
					<div className='public-footer__utility'>
						<p>670 1st St., Idaho Falls, ID 83401</p>
						<a href='tel:2085249900'>(208) 524-9900</a>
						<a
							href='https://www.facebook.com/bowerolanesidahofalls'
							target='_blank'
							rel='noreferrer'
						>
							Facebook Page
						</a>
						<a href='#top' onClick={handleBackToTop}>
							Back to Top
						</a>
					</div>

					<p>© {new Date().getFullYear()} Bowl-Ero Lanes. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}