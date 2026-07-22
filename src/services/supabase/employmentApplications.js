import { supabase } from './client'

export async function getEmploymentApplications() {
	const { data, error } = await supabase
		.from('employment_applications')
		.select('*')
		.order('reviewed', { ascending: true })
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function getEmploymentApplicationById(id) {
	const { data, error } = await supabase
		.from('employment_applications')
		.select('*')
		.eq('id', id)
		.maybeSingle()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function markEmploymentApplicationReviewed(id) {
	const beforeRow = await getEmploymentApplicationById(id)

	if (!beforeRow) {
		throw new Error(`No application found for id: ${id}`)
	}

	const { error } = await supabase
		.from('employment_applications')
		.update({
			reviewed: true,
			reviewed_at: new Date().toISOString(),
		})
		.eq('id', id)

	if (error) {
		throw new Error(`Update failed: ${error.message}`)
	}

	const afterRow = await getEmploymentApplicationById(id)

	if (!afterRow) {
		throw new Error(`Application disappeared after update for id: ${id}`)
	}

	if (afterRow.reviewed !== true) {
		throw new Error(
			`Application update did not persist. Before reviewed=${beforeRow.reviewed}, after reviewed=${afterRow.reviewed}`
		)
	}

	return afterRow
}