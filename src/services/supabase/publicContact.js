import { supabase } from './client';

export async function createPublicMessage(messageData) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        ...messageData,
        is_read: false,
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}