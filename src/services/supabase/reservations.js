import { supabase } from './client'

export async function getReservationBlockouts() {
	const { data, error } = await supabase
		.from('reservation_blockouts')
		.select('*')
		.order('block_date', { ascending: true })
		.order('start_time', { ascending: true })
		.order('created_at', { ascending: true })

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function createReservationBlockout(blockoutData) {
	const { data, error } = await supabase
		.from('reservation_blockouts')
		.insert([blockoutData])
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function updateReservationBlockout(id, updates) {
	const { data, error } = await supabase
		.from('reservation_blockouts')
		.update(updates)
		.eq('id', id)
		.select()
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deleteReservationBlockout(id) {
	const { error } = await supabase.from('reservation_blockouts').delete().eq('id', id)

	if (error) {
		throw new Error(error.message)
	}
}