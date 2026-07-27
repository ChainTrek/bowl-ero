import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV_LINKS = [
	{ to: '/', label: 'Home', end: true },
	{ to: '/tournaments', label: 'Tournaments' },
	{ to: '/league-scores', label: 'League Scores' },
	{ to: '/cafe', label: 'Cafe' },
	{ to: '/reservations', label: 'Reservations' },
	{ to: '/contact', label: 'Contact' },
	{ to: '/employment', label: 'Employment' },
]

export default function PublicNavbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	useEffect(() => {
		function handleResize() {
			if (window.innerWidth > 900) {
				setIsMobileMenuOpen(false)
			}
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	function toggleMobileMenu() {
		setIsMobileMenuOpen(previousState => !previousState)
	}

	function closeMobileMenu() {
		setIsMobileMenuOpen(false)
	}

	return (
		<header className='public-navbar'>
			<div className='public-container public-navbar__inner'>
				<Link
					to='/'
					className='public-navbar__brand'
					onClick={closeMobileMenu}
				>
					Bowl-Ero
				</Link>

				<button
					type='button'
					className={`public-navbar__toggle ${
						isMobileMenuOpen
							? 'public-navbar__toggle--open'
							: ''
					}`}
					aria-expanded={isMobileMenuOpen}
					aria-controls='public-site-navigation'
					aria-label={
						isMobileMenuOpen
							? 'Close navigation menu'
							: 'Open navigation menu'
					}
					onClick={toggleMobileMenu}
				>
					<span className='public-navbar__toggle-line' />
					<span className='public-navbar__toggle-line' />
					<span className='public-navbar__toggle-line' />
				</button>

				<nav
					id='public-site-navigation'
					className={`public-navbar__nav ${
						isMobileMenuOpen
							? 'public-navbar__nav--open'
							: ''
					}`}
					aria-label='Public site navigation'
				>
					{NAV_LINKS.map(link => (
						<NavLink
							key={link.to}
							to={link.to}
							end={link.end}
							onClick={closeMobileMenu}
							className={({ isActive }) =>
								`public-navbar__link ${
									isActive
										? 'public-navbar__link--active'
										: ''
								}`
							}
						>
							{link.label}
						</NavLink>
					))}
				</nav>
			</div>
		</header>
	)
}