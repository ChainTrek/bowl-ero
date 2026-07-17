import { supabase } from './client'

export async function getActiveLeagues() {
	const { data, error } = await supabase
		.from('leagues')
		.select('*')
		.eq('is_active', true)
		.order('day_of_week', { ascending: true, nullsFirst: false })
		.order('name', { ascending: true })

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function getLeagueWeeks() {
	const { data, error } = await supabase
		.from('league_weeks')
		.select(
			`
      *,
      leagues (
        id,
        name,
        day_of_week
      )
    `,
		)
		.order('week_date', { ascending: false, nullsFirst: false })
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function createLeagueWeek(weekData) {
	const { data, error } = await supabase
		.from('league_weeks')
		.insert([weekData])
		.select(
			`
      *,
      leagues (
        id,
        name,
        day_of_week
      )
    `,
		)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function updateLeagueWeek(id, updates) {
	const { data, error } = await supabase
		.from('league_weeks')
		.update(updates)
		.eq('id', id)
		.select(
			`
      *,
      leagues (
        id,
        name,
        day_of_week
      )
    `,
		)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deleteLeagueWeek(id) {
	const { error: deleteScoresError } = await supabase.from('player_scores').delete().eq('league_week_id', id)

	if (deleteScoresError) {
		throw new Error(deleteScoresError.message)
	}

	const { error: deleteWeekError } = await supabase.from('league_weeks').delete().eq('id', id)

	if (deleteWeekError) {
		throw new Error(deleteWeekError.message)
	}
}

export async function getPlayerScoresByWeek(leagueWeekId) {
	const { data, error } = await supabase
		.from('player_scores')
		.select('*')
		.eq('league_week_id', leagueWeekId)
		.order('display_order', { ascending: true })
		.order('created_at', { ascending: true })

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function createPlayerScore(scoreData) {
	const { data, error } = await supabase.from('player_scores').insert([scoreData]).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function createMultiplePlayerScores(scoreRows) {
	const { data, error } = await supabase.from('player_scores').insert(scoreRows).select()

	if (error) {
		throw new Error(error.message)
	}

	return data ?? []
}

export async function updatePlayerScore(id, updates) {
	const { data, error } = await supabase.from('player_scores').update(updates).eq('id', id).select().single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export async function deletePlayerScore(id) {
	const { error } = await supabase.from('player_scores').delete().eq('id', id)

	if (error) {
		throw new Error(error.message)
	}
}
