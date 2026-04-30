import { supabase } from './client'

const BUCKET_NAME = 'announcements'

function createFilePath(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  return `uploads/${fileName}`
}

export async function getAnnouncements() {
  const { data, error } = await supabase.from('announcements').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false })

  if(error) {
    throw new Error(error.message)
  }

  return data
}

export async function uploadAnnouncementImage(file) {
  const filePath = createFilePath(file)
  const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type
  })

  if(uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return{
    imagePath: filePath,
    imageUrl: data.publicUrl,
  }
}

export async function createAnnouncement(announcementData) {
  const { data, error } = await supabase.from('announcements').insert([announcementData]).select()

  if(error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function updateAnnouncement(id, updates) {
  const { data, error } = await supabase.from('announcements').update(updates).eq('id', id).select()

  if(error) {
    throw new Error(error.message)
  }

  return data[0]
}