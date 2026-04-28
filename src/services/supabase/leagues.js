import { supabase } from './client';

export async function getLeagues() {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .order('is_active', { ascending: false })
    .order('day_of_week', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createLeague(leagueData) {
  const { data, error } = await supabase
    .from('leagues')
    .insert([leagueData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateLeague(id, updates) {
  const { data, error } = await supabase
    .from('leagues')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function toggleLeagueActive(id, isActive) {
  const { data, error } = await supabase
    .from('leagues')
    .update({ is_active: !isActive })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}