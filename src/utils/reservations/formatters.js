export function formatReservationDate(value) {
	if (!value) {
		return 'No date set'
	}

	const [year, month, day] = value.split('-')

	if (!year || !month || !day) {
		return value
	}

	return `${month}/${day}/${year}`
}

export function formatReservationTime(value) {
	if (!value) {
		return ''
	}

	const [hours, minutes] = value.split(':')

	if (hours === undefined || minutes === undefined) {
		return value
	}

	const hourNumber = Number(hours)

	if (Number.isNaN(hourNumber)) {
		return value
	}

	const suffix = hourNumber >= 12 ? 'PM' : 'AM'
	const normalizedHour = hourNumber % 12 || 12

	return `${normalizedHour}:${minutes} ${suffix}`
}

export function formatReservationTimeRange(startTime, endTime) {
	const formattedStartTime = formatReservationTime(startTime)
	const formattedEndTime = formatReservationTime(endTime)

	if (!formattedStartTime && !formattedEndTime) {
		return 'No time set'
	}

	if (!formattedStartTime) {
		return formattedEndTime
	}

	if (!formattedEndTime) {
		return formattedStartTime
	}

	return `${formattedStartTime} - ${formattedEndTime}`
}