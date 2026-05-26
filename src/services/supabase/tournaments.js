import { supabase } from './client';

export async function getTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('tournament_date', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createTournament(tournamentData) {
  const { data, error } = await supabase
    .from('tournaments')
    .insert([tournamentData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateTournament(id, updates) {
  const { data, error } = await supabase
    .from('tournaments')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function toggleTournamentActive(id, isActive) {
  const { data, error } = await supabase
    .from('tournaments')
    .update({ is_active: !isActive })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function deleteTournament(id) {
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}