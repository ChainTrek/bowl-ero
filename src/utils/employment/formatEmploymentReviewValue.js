export function formatEmploymentReviewValue(value) {
  if (value === null || value === undefined) {
    return 'Not provided';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'string' && value.trim() === '') {
    return 'Not provided';
  }

  return value;
}

export function formatEmploymentReviewYesNo(value) {
  if (value === 'yes') return 'Yes';
  if (value === 'no') return 'No';
  return 'Not provided';
}