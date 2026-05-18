import { supabase } from './client'

export async function getMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })

  if(error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateMessageReadStatus(id, isRead) {
  const { data, error } = await supabase.from('messages').update({ is_read: isRead }).eq('id', id).select()

  if(error) {
    throw new Error(error.message)
  }

  return data[0]
}