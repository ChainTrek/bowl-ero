import { supabase } from './client'

export async function getAdminSidebarCounts() {
	const [
		unreadMessagesResult,
		pendingReservationsResult,
		unreviewedApplicationsResult,
	] = await Promise.all([
		supabase
			.from('messages')
			.select('id', { count: 'exact', head: true })
			.eq('is_read', false),

		supabase
			.from('reservation_requests')
			.select('id', { count: 'exact', head: true })
			.eq('status', 'pending'),

		supabase
			.from('employment_applications')
			.select('id', { count: 'exact', head: true })
			.eq('reviewed', false),
	])

	if (unreadMessagesResult.error) {
		throw new Error(`Messages count error: ${unreadMessagesResult.error.message}`)
	}

	if (pendingReservationsResult.error) {
		throw new Error(
			`Reservation requests count error: ${pendingReservationsResult.error.message}`,
		)
	}

	if (unreviewedApplicationsResult.error) {
		throw new Error(
			`Applications count error: ${unreviewedApplicationsResult.error.message}`,
		)
	}

	return {
		messages: unreadMessagesResult.count ?? 0,
		reservationRequests: pendingReservationsResult.count ?? 0,
		applications: unreviewedApplicationsResult.count ?? 0,
	}
}