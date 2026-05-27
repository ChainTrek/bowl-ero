import { supabase } from './client';

export async function createEmploymentApplication(applicationData) {
  const { data, error } = await supabase
    .from('employment_applications')
    .insert([applicationData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}