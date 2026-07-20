export function timeToMinutes(timeValue) {
	if (!timeValue || typeof timeValue !== 'string') return null

	const [hours, minutes] = timeValue.split(':')
	const parsedHours = Number(hours)
	const parsedMinutes = Number(minutes)

	if (Number.isNaN(parsedHours) || Number.isNaN(parsedMinutes)) {
		return null
	}

	return parsedHours * 60 + parsedMinutes
}

export function rangesOverlap(startA, endA, startB, endB) {
	const normalizedStartA = timeToMinutes(startA)
	const normalizedEndA = timeToMinutes(endA)
	const normalizedStartB = timeToMinutes(startB)
	const normalizedEndB = timeToMinutes(endB)

	if (
		normalizedStartA === null ||
		normalizedEndA === null ||
		normalizedStartB === null ||
		normalizedEndB === null
	) {
		return false
	}

	return normalizedStartA < normalizedEndB && normalizedStartB < normalizedEndA
}

export function isValidTimeRange(startTime, endTime) {
	const normalizedStart = timeToMinutes(startTime)
	const normalizedEnd = timeToMinutes(endTime)

	if (normalizedStart === null || normalizedEnd === null) {
		return false
	}

	return normalizedEnd > normalizedStart
}

export function formatTimeRange(startTime, endTime) {
	if (!startTime || !endTime) return ''

	function formatSingleTime(value) {
		const [hours, minutes] = value.split(':')
		const parsedHours = Number(hours)
		const suffix = parsedHours >= 12 ? 'PM' : 'AM'
		const normalizedHour = parsedHours % 12 || 12

		return `${normalizedHour}:${minutes} ${suffix}`
	}

	return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`
}