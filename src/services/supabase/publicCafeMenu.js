import { supabase } from './client';

export async function getPublicCafeMenuItems() {
  const { data, error } = await supabase
    .from('cafe_menu_items')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true, nullsFirst: false })
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}