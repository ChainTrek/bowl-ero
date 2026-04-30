import { supabase } from './client'

export async function getHours() {
  const { data, error } = await supabase.from('hours_of_operation').select('*').order('display_order', {ascending: true})

  if(error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateHoursRow(id, updates) {
  const { data, error } = await supabase.from('hours_of_operation').update(updates).eq('id', id).select()

  if(error) {
    throw new Error(error.message)
  }

  return data[0]
}