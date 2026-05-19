import { supabase } from './client';

export async function getPublicHours() {
  const { data, error } = await supabase
    .from('hours_of_operation')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}