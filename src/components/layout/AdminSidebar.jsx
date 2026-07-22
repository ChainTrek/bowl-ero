import { NavLink } from 'react-router-dom'

function SidebarCountBadge({ count }) {
	return <span className='admin-sidebar__count-badge'>{count}</span>
}

export default function AdminSidebar({
	counts = {
		messages: 0,
		reservationRequests: 0,
		applications: 0,
	},
	loadingCounts = false,
}) {
	return (
		<aside className='admin-sidebar'>
			<div className='admin-sidebar__brand'>
				<h2>
					<NavLink to='/'>Bowl-ero</NavLink> Admin
				</h2>
			</div>

			<nav className='admin-sidebar__nav'>
				<NavLink to='/admin' end>
					<span>Dashboard</span>
				</NavLink>

				<NavLink to='/admin/messages'>
					<span>Messages</span>
					{!loadingCounts && <SidebarCountBadge count={counts.messages} />}
				</NavLink>

				<NavLink to='/admin/leagues'>
					<span>Leagues</span>
				</NavLink>

				<NavLink to='/admin/tournaments'>
					<span>Tournaments</span>
				</NavLink>

				<NavLink to='/admin/scores'>
					<span>Scores</span>
				</NavLink>

				<NavLink to='/admin/reservation-blockouts'>
					<span>Reservation Blockouts</span>
				</NavLink>

				<NavLink to='/admin/reservation-requests'>
					<span>Reservation Requests</span>
					{!loadingCounts && (
						<SidebarCountBadge count={counts.reservationRequests} />
					)}
				</NavLink>

				<NavLink to='/admin/hours'>
					<span>Hours</span>
				</NavLink>

				<NavLink to='/admin/announcements'>
					<span>Announcements</span>
				</NavLink>

				<NavLink to='/admin/cafe-menu'>
					<span>Cafe Menu</span>
				</NavLink>

				<NavLink to='/admin/applications'>
					<span>Applications</span>
					{!loadingCounts && <SidebarCountBadge count={counts.applications} />}
				</NavLink>
			</nav>
		</aside>
	)
}