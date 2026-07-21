import { supabase } from './client'

export async function getReservationRequests(status = '') {
	let query = supabase
		.from('reservation_requests')
		.select('*')
		.order('created_at', { ascending: false })

	if (status) {
		query = query.eq('status', status)
	}

	const { data, error } = await query

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function updateReservationRequest(id, updates) {
	const { data, error } = await supabase
		.from('reservation_requests')
		.update(updates)
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}