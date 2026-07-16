function displayValue(value) {
	if (value === null || value === undefined || value === '') {
		return '—'
	}

	if (typeof value === 'boolean') {
		return value ? 'Yes' : 'No'
	}

	if (value === 'yes') {
		return 'Yes'
	}

	if (value === 'no') {
		return 'No'
	}

	return String(value)
}

export default function EmploymentReviewField({ label, value }) {
	return (
		<div className='employment-review-field'>
			<p className='employment-review-field__label'>{label}</p>
			<p className='employment-review-field__value'>{displayValue(value)}</p>
		</div>
	)
}