export function formatDateTime(dateValue) {
  if (!dateValue) return '';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}