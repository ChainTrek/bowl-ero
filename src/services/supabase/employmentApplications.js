import { supabase } from './client';

export async function getEmploymentApplications() {
  const { data, error } = await supabase
    .from('employment_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}