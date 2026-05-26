export function formatHoursTime(timeValue) {
  if (!timeValue) return '';

  const [hourString, minute] = timeValue.split(':');
  const hour = Number(hourString);

  if (Number.isNaN(hour)) return timeValue;

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 || 12;

  return `${normalizedHour}:${minute} ${suffix}`;
}