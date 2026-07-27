import { useEffect, useMemo, useState } from 'react'
import {
	getHours,
	updateHoursRow,
	updateMultipleHoursRows,
} from '../../services/supabase/hours'

function rowsAreEqual(firstRow, secondRow) {
	return (
		firstRow.day_of_week === secondRow.day_of_week &&
		(firstRow.open_time || '') ===
			(secondRow.open_time || '') &&
		(firstRow.close_time || '') ===
			(secondRow.close_time || '') &&
		firstRow.is_closed === secondRow.is_closed &&
		firstRow.display_order === secondRow.display_order
	)
}

export default function HoursPage() {
	const [hours, setHours] = useState([])
	const [originalHours, setOriginalHours] = useState([])
	const [loading, setLoading] = useState(true)
	const [savingRowId, setSavingRowId] = useState(null)
	const [savingAll, setSavingAll] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')

	useEffect(() => {
		let isMounted = true

		async function loadHours() {
			try {
				const data = await getHours()

				if (isMounted) {
					setHours(data)
					setOriginalHours(data)
				}
			} catch (error) {
				if (isMounted) {
					setStatusMessage(
						`Error loading hours: ${error.message}`,
					)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadHours()

		return () => {
			isMounted = false
		}
	}, [])

	const changedRows = useMemo(() => {
		return hours.filter(row => {
			const originalRow = originalHours.find(
				item => item.id === row.id,
			)

			if (!originalRow) {
				return false
			}

			return !rowsAreEqual(row, originalRow)
		})
	}, [hours, originalHours])

	const hasUnsavedChanges = changedRows.length > 0

	function handleChange(id, field, value) {
		setHours(previousHours =>
			previousHours.map(row =>
				row.id === id
					? {
							...row,
							[field]: value,
						}
					: row,
			),
		)
	}

	async function handleSave(row) {
		try {
			setSavingRowId(row.id)
			setStatusMessage('')

			const updatedRow = await updateHoursRow(row.id, {
				day_of_week: row.day_of_week,
				open_time: row.is_closed
					? null
					: row.open_time || null,
				close_time: row.is_closed
					? null
					: row.close_time || null,
				is_closed: row.is_closed,
				display_order: row.display_order,
			})

			setHours(previousHours =>
				previousHours.map(item =>
					item.id === row.id ? updatedRow : item,
				),
			)

			setOriginalHours(previousHours =>
				previousHours.map(item =>
					item.id === row.id ? updatedRow : item,
				),
			)

			setStatusMessage(
				`${row.day_of_week} updated successfully.`,
			)
		} catch (error) {
			setStatusMessage(
				`Error saving hours: ${error.message}`,
			)
		} finally {
			setSavingRowId(null)
		}
	}

	async function handleSaveAll() {
		if (!hasUnsavedChanges) {
			setStatusMessage('No changes to save.')
			return
		}

		try {
			setSavingAll(true)
			setStatusMessage('')

			const updatedRows =
				await updateMultipleHoursRows(changedRows)

			setHours(previousHours =>
				previousHours.map(row => {
					const updatedRow = updatedRows.find(
						item => item.id === row.id,
					)

					return updatedRow || row
				}),
			)

			setOriginalHours(previousHours =>
				previousHours.map(row => {
					const updatedRow = updatedRows.find(
						item => item.id === row.id,
					)

					return updatedRow || row
				}),
			)

			setStatusMessage(
				`Saved ${updatedRows.length} day(s) successfully.`,
			)
		} catch (error) {
			setStatusMessage(
				`Error saving all hours: ${error.message}`,
			)
		} finally {
			setSavingAll(false)
		}
	}

	function handleResetChanges() {
		setHours(originalHours)
		setStatusMessage('Unsaved changes were reset.')
	}

	return (
		<section className='admin-page hours-page'>
			<div className='admin-page__header'>
				<h1>Hours of Operation</h1>
				<p>
					Update business hours without changing code.
				</p>
			</div>

			<div className='admin-card'>
				<div className='hours-toolbar'>
					<div>
						<h2>Weekly Hours</h2>

						<p>
							{hasUnsavedChanges
								? `${changedRows.length} row(s) have unsaved changes.`
								: 'No unsaved changes.'}
						</p>
					</div>

					<div className='hours-toolbar__actions'>
						<button
							type='button'
							className='secondary-button'
							onClick={handleResetChanges}
							disabled={
								!hasUnsavedChanges || savingAll
							}
						>
							Reset Changes
						</button>

						<button
							type='button'
							onClick={handleSaveAll}
							disabled={
								!hasUnsavedChanges || savingAll
							}
						>
							{savingAll
								? 'Saving All...'
								: 'Save All'}
						</button>
					</div>
				</div>

				{statusMessage && (
					<p className='status-message'>
						{statusMessage}
					</p>
				)}

				{loading ? (
					<p>Loading hours...</p>
				) : (
					<div className='hours-list'>
						{hours.map(row => {
							const originalRow =
								originalHours.find(
									item => item.id === row.id,
								)

							const isDirty = originalRow
								? !rowsAreEqual(row, originalRow)
								: false

							return (
								<article
									className={`hours-item ${
										isDirty
											? 'hours-item--dirty'
											: ''
									}`}
									key={row.id}
								>
									<div className='hours-item__day'>
										<h3>{row.day_of_week}</h3>

										{isDirty && (
											<span className='dirty-badge'>
												Unsaved
											</span>
										)}
									</div>

									<div className='hours-item__fields'>
										<div className='form-checkbox'>
											<label
												htmlFor={`closed-${row.id}`}
											>
												<input
													id={`closed-${row.id}`}
													type='checkbox'
													checked={
														row.is_closed
													}
													onChange={event =>
														handleChange(
															row.id,
															'is_closed',
															event.target
																.checked,
														)
													}
												/>
												Closed
											</label>
										</div>

										<div className='form-group'>
											<label
												htmlFor={`open-${row.id}`}
											>
												Open
											</label>

											<input
												id={`open-${row.id}`}
												type='time'
												value={
													row.open_time || ''
												}
												onChange={event =>
													handleChange(
														row.id,
														'open_time',
														event.target
															.value,
													)
												}
												disabled={
													row.is_closed
												}
											/>
										</div>

										<div className='form-group'>
											<label
												htmlFor={`close-${row.id}`}
											>
												Close
											</label>

											<input
												id={`close-${row.id}`}
												type='time'
												value={
													row.close_time ||
													''
												}
												onChange={event =>
													handleChange(
														row.id,
														'close_time',
														event.target
															.value,
													)
												}
												disabled={
													row.is_closed
												}
											/>
										</div>
									</div>

									<div className='hours-item__actions'>
										<button
											type='button'
											onClick={() =>
												handleSave(row)
											}
											disabled={
												savingRowId ===
													row.id ||
												savingAll ||
												!isDirty
											}
										>
											{savingRowId === row.id
												? 'Saving...'
												: 'Save Row'}
										</button>
									</div>
								</article>
							)
						})}
					</div>
				)}
			</div>
		</section>
	)
}