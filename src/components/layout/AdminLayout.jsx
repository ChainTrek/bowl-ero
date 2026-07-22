import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../../context/AuthContext'
import { getAdminSidebarCounts } from '../../services/supabase/adminCounts'
import bowleroLogo from '../../assets/bowlero-logo.png'

export default function AdminLayout() {
	const { user, logout } = useAuth()
	const location = useLocation()

	const [counts, setCounts] = useState({
		messages: 0,
		reservationRequests: 0,
		applications: 0,
	})
	const [loadingCounts, setLoadingCounts] = useState(true)

	useEffect(() => {
		refreshCounts()
	}, [location.pathname])

	async function refreshCounts() {
		try {
			setLoadingCounts(true)
			const data = await getAdminSidebarCounts()
			setCounts(data)
		} catch (error) {
			console.error('Unable to load admin sidebar counts:', error.message)
		} finally {
			setLoadingCounts(false)
		}
	}

	function markApplicationCountReviewed() {
		setCounts(prev => ({
			...prev,
			applications: Math.max(0, prev.applications - 1),
		}))
	}

	async function handleLogout() {
		try {
			await logout()
		} catch (error) {
			console.error('Logout failed:', error.message)
		}
	}

	return (
		<div className='admin-layout'>
			<AdminSidebar counts={counts} loadingCounts={loadingCounts} />

			<main className='admin-layout__content'>
				<div className='admin-topbar'>
					<div>
						<Link to='/' className='site-logo-link' aria-label='Go to home page'>
							<img
								className='site-logo site-logo--admin'
								src={bowleroLogo}
								alt='Bowlero logo'
							/>
						</Link>

						<p>Signed in as {user?.email}</p>
					</div>

					<button type='button' onClick={handleLogout}>
						Sign Out
					</button>
				</div>

				<Outlet context={{ refreshCounts, markApplicationCountReviewed }} />
			</main>
		</div>
	)
}