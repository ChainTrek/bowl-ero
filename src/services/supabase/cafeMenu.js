import { supabase } from './client';

const BUCKET_NAME = 'cafe-menu';

function createFilePath(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  return `uploads/${fileName}`;
}

export async function getCafeMenuItems() {
  const { data, error } = await supabase
    .from('cafe_menu_items')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function uploadCafeMenuImage(file) {
  const filePath = createFilePath(file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    imagePath: filePath,
    imageUrl: data.publicUrl,
  };
}

export async function createCafeMenuItem(menuItemData) {
  const { data, error } = await supabase
    .from('cafe_menu_items')
    .insert([menuItemData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateCafeMenuItem(id, updates) {
  const { data, error } = await supabase
    .from('cafe_menu_items')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function toggleCafeMenuItemActive(id, isActive) {
  const { data, error } = await supabase
    .from('cafe_menu_items')
    .update({ is_active: !isActive })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}