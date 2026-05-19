import { supabase } from './client';

export async function getPublicTournaments() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('is_active', true)
    .gte('tournament_date', today)
    .order('tournament_date', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}