import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import ScrollToTop from './ScrollToTop'

const Home = lazy(() => import('../pages/Home'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const EmploymentPage = lazy(() => import('../pages/EmploymentPage'))
const TournamentsPublicPage = lazy(() =>
	import('../pages/TournamentsPublicPage'),
)
const LeagueScoresPublicPage = lazy(() =>
	import('../pages/LeagueScoresPublicPage'),
)
const CafePublicPage = lazy(() => import('../pages/CafePublicPage'))
const ReservationsPage = lazy(() => import('../pages/ReservationsPage'))

const AdminLayout = lazy(() =>
	import('../components/layout/AdminLayout'),
)
const AdminLoginPage = lazy(() =>
	import('../pages/admin/AdminLoginPage'),
)
const AdminDashboard = lazy(() =>
	import('../pages/admin/AdminDashboard'),
)
const MessagesPage = lazy(() =>
	import('../pages/admin/MessagesPage'),
)
const LeaguesPage = lazy(() =>
	import('../pages/admin/LeaguesPage'),
)
const ScoresPage = lazy(() =>
	import('../pages/admin/ScoresPage'),
)
const HoursPage = lazy(() =>
	import('../pages/admin/HoursPage'),
)
const AnnouncementsPage = lazy(() =>
	import('../pages/admin/AnnouncementsPage'),
)
const TournamentsPage = lazy(() =>
	import('../pages/admin/TournamentsPage'),
)
const CafeMenuPage = lazy(() =>
	import('../pages/admin/CafeMenuPage'),
)
const ReservationBlockoutsPage = lazy(() =>
	import('../pages/admin/ReservationBlockoutsPage'),
)
const ReservationRequestsPage = lazy(() =>
	import('../pages/admin/ReservationRequestsPage'),
)
const EmploymentApplicationsPage = lazy(() =>
	import('../pages/admin/EmploymentApplicationsPage'),
)
const EmploymentApplicationDetailPage = lazy(() =>
	import('../pages/admin/EmploymentApplicationDetailPage'),
)

function RouteLoadingFallback() {
	return (
		<div
			className='route-loading'
			role='status'
			aria-live='polite'
		>
			<p>Loading...</p>
		</div>
	)
}

export default function AppRouter() {
	return (
		<BrowserRouter>
			<ScrollToTop />

			<Suspense fallback={<RouteLoadingFallback />}>
				<Routes>
					<Route path='/' element={<Home />} />

					<Route
						path='/tournaments'
						element={<TournamentsPublicPage />}
					/>

					<Route
						path='/league-scores'
						element={<LeagueScoresPublicPage />}
					/>

					<Route
						path='/cafe'
						element={<CafePublicPage />}
					/>

					<Route
						path='/contact'
						element={<ContactPage />}
					/>

					<Route
						path='/employment'
						element={<EmploymentPage />}
					/>

					<Route
						path='/reservations'
						element={<ReservationsPage />}
					/>

					<Route
						path='/admin/login'
						element={<AdminLoginPage />}
					/>

					<Route
						path='/admin'
						element={
							<ProtectedRoute>
								<AdminLayout />
							</ProtectedRoute>
						}
					>
						<Route
							index
							element={<AdminDashboard />}
						/>

						<Route
							path='messages'
							element={<MessagesPage />}
						/>

						<Route
							path='leagues'
							element={<LeaguesPage />}
						/>

						<Route
							path='scores'
							element={<ScoresPage />}
						/>

						<Route
							path='hours'
							element={<HoursPage />}
						/>

						<Route
							path='announcements'
							element={<AnnouncementsPage />}
						/>

						<Route
							path='tournaments'
							element={<TournamentsPage />}
						/>

						<Route
							path='cafe-menu'
							element={<CafeMenuPage />}
						/>

						<Route
							path='reservation-blockouts'
							element={<ReservationBlockoutsPage />}
						/>

						<Route
							path='reservation-requests'
							element={<ReservationRequestsPage />}
						/>

						<Route
							path='applications'
							element={<EmploymentApplicationsPage />}
						/>

						<Route
							path='applications/:id'
							element={
								<EmploymentApplicationDetailPage />
							}
						/>
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}