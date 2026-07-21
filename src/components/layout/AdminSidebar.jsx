import { NavLink } from 'react-router-dom'

export default function AdminSidebar() {
	return (
		<aside className='admin-sidebar'>
			<div className='admin-sidebar__brand'>
				<h2>
					<NavLink to='/'>Bowl-ero</NavLink> Admin
				</h2>
			</div>
			<nav className='admin-sidebar__nav'>
				<NavLink to='/admin' end>
					Dashboard
				</NavLink>
				<NavLink to='/admin/messages'>Messages</NavLink>
				<NavLink to='/admin/leagues'>Leagues</NavLink>
				<NavLink to='/admin/tournaments'>Tournaments</NavLink>
				<NavLink to='/admin/scores'>Scores</NavLink>
				<NavLink to='/admin/reservation-blockouts'>Reservation Blockouts</NavLink>
				<NavLink to='/admin/reservation-requests'>Reservation Requests</NavLink>
				<NavLink to='/admin/hours'>Hours</NavLink>
				<NavLink to='/admin/announcements'>Announcements</NavLink>
				<NavLink to='/admin/cafe-menu'>Cafe Menu</NavLink>
				<NavLink to='/admin/applications'>Applications</NavLink>
			</nav>
		</aside>
	)
}