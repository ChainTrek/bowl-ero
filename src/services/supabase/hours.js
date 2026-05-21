import { supabase } from './client';

export async function getHours() {
  const { data, error } = await supabase
    .from('hours_of_operation')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateHoursRow(id, updates) {
  const { data, error } = await supabase
    .from('hours_of_operation')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateMultipleHoursRows(rows) {
  const results = await Promise.all(
    rows.map((row) =>
      supabase
        .from('hours_of_operation')
        .update({
          day_of_week: row.day_of_week,
          open_time: row.is_closed ? null : row.open_time || null,
          close_time: row.is_closed ? null : row.close_time || null,
          is_closed: row.is_closed,
          display_order: row.display_order,
        })
        .eq('id', row.id)
        .select()
    )
  );

  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    throw new Error(errors[0].error.message);
  }

  return results.map((result) => result.data[0]);
}