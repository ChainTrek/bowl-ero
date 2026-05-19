import { supabase } from './client';

export async function getPublicAnnouncements() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }

  const filteredAnnouncements = (data || []).filter((item) => {
    const startsOk = !item.start_date || item.start_date <= today;
    const endsOk = !item.end_date || item.end_date >= today;
    return startsOk && endsOk;
  });

  return filteredAnnouncements;
}