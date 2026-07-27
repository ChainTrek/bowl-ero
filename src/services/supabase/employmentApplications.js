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
	const { error } = await supabase
		.from('employment_applications')
		.update({
			reviewed: true,
			reviewed_at: new Date().toISOString(),
		})
		.eq('id', id)

	if (error) {
		throw new Error(error.message)
	}

	const refreshedRow = await getEmploymentApplicationById(id)

	if (!refreshedRow) {
		throw new Error('Application was updated but could not be reloaded.')
	}

	return refreshedRow
}