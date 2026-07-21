import { supabase } from './client'

export async function getPublicReservationBlockouts() {
	const { data, error } = await supabase
		.from('reservation_blockouts')
		.select('*')
		.eq('is_active', true)
		.order('block_date', { ascending: true })
		.order('start_time', { ascending: true })

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function createReservationRequest(requestData) {
	const { data, error } = await supabase
		.from('reservation_requests')
		.insert([requestData])
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}