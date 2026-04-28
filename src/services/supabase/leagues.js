import { supabase } from './client'

export async function getLeagues() {
  const { data, error } = await supabase.from('leagues').select('*').order('created_at', {ascending: false})

  if(error){
    throw new Error(error.message)
  }

  return data
}

export async function createLeague(leagueData) {
  const { data, error } = await supabase.from('leagues').insert([leagueData]).select()

  if(error){
    throw new Error(error.message)
  }

  return data[0]
}

export async function deleteLeague(id) {
  const { error } = await supabase.from('leagues').delete().eq('id', id)

  if(error){
    throw new Error(error.message)
  }
}