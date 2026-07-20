import { isValidTimeRange, rangesOverlap, formatTimeRange } from './time'

export function getActiveBlockoutsForDate(blockouts, targetDate) {
	if (!Array.isArray(blockouts) || !targetDate) return []

	return blockouts.filter(blockout => {
		return blockout?.is_active && blockout?.block_date === targetDate
	})
}

export function findBlockingReservationBlockout({
	blockouts,
	targetDate,
	startTime,
	endTime,
}) {
	if (!isValidTimeRange(startTime, endTime)) {
		return null
	}

	const matchingBlockouts = getActiveBlockoutsForDate(blockouts, targetDate)

	return (
		matchingBlockouts.find(blockout =>
			rangesOverlap(startTime, endTime, blockout.start_time, blockout.end_time),
		) || null
	)
}

export function isReservationSlotBlocked({
	blockouts,
	targetDate,
	startTime,
	endTime,
}) {
	return Boolean(
		findBlockingReservationBlockout({
			blockouts,
			targetDate,
			startTime,
			endTime,
		}),
	)
}

export function getReservationAvailability({
	blockouts,
	targetDate,
	startTime,
	endTime,
}) {
	if (!targetDate) {
		return {
			isAvailable: false,
			reason: 'Please choose a date.',
			blockingBlockout: null,
		}
	}

	if (!startTime || !endTime) {
		return {
			isAvailable: false,
			reason: 'Please choose both a start and end time.',
			blockingBlockout: null,
		}
	}

	if (!isValidTimeRange(startTime, endTime)) {
		return {
			isAvailable: false,
			reason: 'End time must be later than start time.',
			blockingBlockout: null,
		}
	}

	const blockingBlockout = findBlockingReservationBlockout({
		blockouts,
		targetDate,
		startTime,
		endTime,
	})

	if (!blockingBlockout) {
		return {
			isAvailable: true,
			reason: '',
			blockingBlockout: null,
		}
	}

	const blockoutTitle = blockingBlockout.title || 'Unavailable time'
	const blockoutRange = formatTimeRange(
		blockingBlockout.start_time,
		blockingBlockout.end_time,
	)

	return {
		isAvailable: false,
		reason: `${blockoutTitle} blocks this time slot${
			blockoutRange ? ` (${blockoutRange})` : ''
		}.`,
		blockingBlockout,
	}
}