import { Link, NavLink } from 'react-router-dom'

export default function PublicNavbar() {
	return (
		<header className='public-navbar'>
			<div className='public-container public-navbar__inner'>
				<Link to='/' className='public-navbar__brand'>
					Bowl-Ero
				</Link>

				<nav className='public-navbar__nav' aria-label='Public site navigation'>
					<NavLink
						to='/'
						end
						className={({ isActive }) =>
							`public-navbar__link ${isActive ? 'public-navbar__link--active' : ''}`
						}
					>
						Home
					</NavLink>

					<NavLink
						to='/tournaments'
						className={({ isActive }) =>
							`public-navbar__link ${isActive ? 'public-navbar__link--active' : ''}`
						}
					>
						Tournaments
					</NavLink>

					<NavLink
						to='/league-scores'
						className={({ isActive }) =>
							`public-navbar__link ${isActive ? 'public-navbar__link--active' : ''}`
						}
					>
						League Scores
					</NavLink>

					<NavLink
						to='/cafe'
						className={({ isActive }) =>
							`public-navbar__link ${isActive ? 'public-navbar__link--active' : ''}`
						}
					>
						Cafe
					</NavLink>

					<NavLink
						to='/reservations'
						className={({ isActive }) =>
							`public-navbar__link ${isActive ? 'public-navbar__link--active' : ''}`
						}
					>
						Reservations
					</NavLink>

					<NavLink
						to='/contact'
						className={({ isActive }) =>
							`public-navbar__link ${isActive ? 'public-navbar__link--active' : ''}`
						}
					>
						Contact
					</NavLink>

					<NavLink
						to='/employment'
						className={({ isActive }) =>
							`public-navbar__link ${isActive ? 'public-navbar__link--active' : ''}`
						}
					>
						Employment
					</NavLink>
				</nav>
			</div>
		</header>
	)
}