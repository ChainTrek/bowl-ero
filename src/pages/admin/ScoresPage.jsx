import { useEffect, useMemo, useState } from 'react'
import {
	getActiveLeagues,
	getLeagueWeeks,
	createLeagueWeek,
	updateLeagueWeek,
	deleteLeagueWeek,
	getPlayerScoresByWeek,
	createPlayerScore,
	createMultiplePlayerScores,
	updatePlayerScore,
	deletePlayerScore,
} from '../../services/supabase/scores'
import { formatScoreLine } from '../../utils/formatScoreLine'

const initialWeekForm = {
	league_id: '',
	week_label: '',
	week_date: '',
}

const initialScoreForm = {
	player_name: '',
	average: '',
	game1: '',
	game2: '',
	game3: '',
	series: '',
	display_order: 0,
}

function createBulkRow(index = 0) {
	return {
		tempId: `${Date.now()}-${Math.random()
			.toString(36)
			.slice(2)}`,
		player_name: '',
		average: '',
		game1: '',
		game2: '',
		game3: '',
		series: '',
		display_order: index,
	}
}

function normalizeNumber(value) {
	return value === '' ? null : Number(value)
}

function sortWeeks(items) {
	return [...items].sort((a, b) => {
		const aDate = a.week_date || ''
		const bDate = b.week_date || ''
		const dateCompare = bDate.localeCompare(aDate)

		if (dateCompare !== 0) {
			return dateCompare
		}

		const aCreated = a.created_at || ''
		const bCreated = b.created_at || ''

		return bCreated.localeCompare(aCreated)
	})
}

function sortScores(items) {
	return [...items].sort((a, b) => {
		const displayOrderCompare =
			Number(a.display_order ?? 0) -
			Number(b.display_order ?? 0)

		if (displayOrderCompare !== 0) {
			return displayOrderCompare
		}

		const createdCompare = String(
			a.created_at || '',
		).localeCompare(String(b.created_at || ''))

		if (createdCompare !== 0) {
			return createdCompare
		}

		return String(a.player_name || '').localeCompare(
			String(b.player_name || ''),
		)
	})
}

function buildScorePayload(row, selectedWeekId) {
	return {
		league_week_id: selectedWeekId,
		player_name: row.player_name.trim(),
		average: normalizeNumber(row.average),
		game1: normalizeNumber(row.game1),
		game2: normalizeNumber(row.game2),
		game3: normalizeNumber(row.game3),
		series: normalizeNumber(row.series),
		display_order:
			normalizeNumber(row.display_order) ?? 0,
	}
}

function isBulkRowValid(row) {
	const playerNameOk = row.player_name.trim() !== ''

	const gamesEntered = [
		row.game1,
		row.game2,
		row.game3,
	].filter(game => game !== '').length

	return playerNameOk && gamesEntered > 0
}

export default function ScoresPage() {
	const [leagues, setLeagues] = useState([])
	const [weeks, setWeeks] = useState([])
	const [selectedLeagueId, setSelectedLeagueId] =
		useState('')
	const [selectedWeekId, setSelectedWeekId] =
		useState(null)

	const [playerScores, setPlayerScores] = useState([])

	const [weekFormData, setWeekFormData] =
		useState(initialWeekForm)
	const [editingWeekId, setEditingWeekId] = useState(null)

	const [scoreFormData, setScoreFormData] =
		useState(initialScoreForm)
	const [editingScoreId, setEditingScoreId] =
		useState(null)

	const [bulkRows, setBulkRows] = useState([
		createBulkRow(0),
		createBulkRow(1),
		createBulkRow(2),
	])

	const [loading, setLoading] = useState(true)
	const [scoreLoading, setScoreLoading] = useState(false)
	const [submittingWeek, setSubmittingWeek] =
		useState(false)
	const [submittingScore, setSubmittingScore] =
		useState(false)
	const [submittingBulk, setSubmittingBulk] =
		useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')

	const filteredWeeks = useMemo(() => {
		if (!selectedLeagueId) {
			return weeks
		}

		return weeks.filter(
			week =>
				String(week.league_id) ===
				String(selectedLeagueId),
		)
	}, [weeks, selectedLeagueId])

	const selectedWeek = useMemo(
		() =>
			weeks.find(week => week.id === selectedWeekId) ||
			null,
		[weeks, selectedWeekId],
	)

	useEffect(() => {
		let isMounted = true

		async function loadPageData() {
			try {
				const [leagueData, weekData] =
					await Promise.all([
						getActiveLeagues(),
						getLeagueWeeks(),
					])

				if (!isMounted) {
					return
				}

				const sortedLeagueData = leagueData ?? []
				const sortedWeekData = sortWeeks(
					weekData ?? [],
				)

				const firstLeagueId =
					sortedLeagueData[0]?.id
						? String(sortedLeagueData[0].id)
						: ''

				const initialWeek =
					sortedWeekData.find(
						week =>
							String(week.league_id) ===
							firstLeagueId,
					) ||
					sortedWeekData[0] ||
					null

				setLeagues(sortedLeagueData)
				setWeeks(sortedWeekData)
				setSelectedLeagueId(firstLeagueId)
				setSelectedWeekId(initialWeek?.id ?? null)

				setWeekFormData({
					...initialWeekForm,
					league_id: firstLeagueId,
				})
			} catch (error) {
				if (isMounted) {
					setErrorMessage(
						`Error loading scores data: ${error.message}`,
					)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadPageData()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		if (!selectedWeekId) {
			return undefined
		}

		let isMounted = true

		async function loadPlayerScores() {
			try {
				setScoreLoading(true)

				const data = await getPlayerScoresByWeek(
					selectedWeekId,
				)

				if (isMounted) {
					setPlayerScores(sortScores(data))
				}
			} catch (error) {
				if (isMounted) {
					setErrorMessage(
						`Error loading player scores: ${error.message}`,
					)
				}
			} finally {
				if (isMounted) {
					setScoreLoading(false)
				}
			}
		}

		loadPlayerScores()

		return () => {
			isMounted = false
		}
	}, [selectedWeekId])

	function clearMessages() {
		setErrorMessage('')
		setSuccessMessage('')
	}

	function handleLeagueFilterChange(event) {
		const nextLeagueId = event.target.value

		const nextVisibleWeeks = nextLeagueId
			? weeks.filter(
					week =>
						String(week.league_id) ===
						String(nextLeagueId),
				)
			: weeks

		const nextWeekId =
			nextVisibleWeeks[0]?.id ?? null

		setSelectedLeagueId(nextLeagueId)
		setSelectedWeekId(nextWeekId)
		setPlayerScores([])
		resetScoreForm()

		if (!editingWeekId) {
			setWeekFormData(previousFormData => ({
				...previousFormData,
				league_id: nextLeagueId,
			}))
		}

		clearMessages()
	}

	function handleWeekChange(event) {
		const { name, value } = event.target

		setWeekFormData(previousFormData => ({
			...previousFormData,
			[name]: value,
		}))
	}

	function handleScoreChange(event) {
		const { name, value } = event.target

		setScoreFormData(previousFormData => ({
			...previousFormData,
			[name]: value,
		}))
	}

	function handleBulkChange(tempId, field, value) {
		setBulkRows(previousRows =>
			previousRows.map(row =>
				row.tempId === tempId
					? {
							...row,
							[field]: value,
						}
					: row,
			),
		)
	}

	function addBulkRow() {
		setBulkRows(previousRows => [
			...previousRows,
			createBulkRow(previousRows.length),
		])
	}

	function removeBulkRow(tempId) {
		setBulkRows(previousRows => {
			if (previousRows.length === 1) {
				return previousRows
			}

			return previousRows.filter(
				row => row.tempId !== tempId,
			)
		})
	}

	function resetBulkRows() {
		setBulkRows([
			createBulkRow(0),
			createBulkRow(1),
			createBulkRow(2),
		])
	}

	function resetWeekForm(
		nextLeagueId = selectedLeagueId,
	) {
		setWeekFormData({
			...initialWeekForm,
			league_id: nextLeagueId || '',
		})

		setEditingWeekId(null)
	}

	function resetScoreForm() {
		setScoreFormData(initialScoreForm)
		setEditingScoreId(null)
	}

	function handleEditWeekClick(week) {
		const leagueId = String(week.league_id ?? '')

		setEditingWeekId(week.id)
		setSelectedLeagueId(leagueId)
		setSelectedWeekId(week.id)
		setPlayerScores([])

		setWeekFormData({
			league_id: leagueId,
			week_label: week.week_label || '',
			week_date: week.week_date || '',
		})

		resetScoreForm()
		clearMessages()
	}

	function handleCancelWeekEdit() {
		resetWeekForm()
		clearMessages()
	}

	function handleSelectWeek(weekId) {
		setSelectedWeekId(weekId)
		setPlayerScores([])
		resetScoreForm()
		clearMessages()
	}

	function handleEditScoreClick(score) {
		setEditingScoreId(score.id)

		setScoreFormData({
			player_name: score.player_name || '',
			average: score.average ?? '',
			game1: score.game1 ?? '',
			game2: score.game2 ?? '',
			game3: score.game3 ?? '',
			series: score.series ?? '',
			display_order: score.display_order ?? 0,
		})

		clearMessages()
	}

	function handleCancelScoreEdit() {
		resetScoreForm()
		clearMessages()
	}

	async function handleWeekSubmit(event) {
		event.preventDefault()

		if (!weekFormData.league_id) {
			setErrorMessage('Please choose a league.')
			setSuccessMessage('')
			return
		}

		if (!weekFormData.week_label.trim()) {
			setErrorMessage('Week label is required.')
			setSuccessMessage('')
			return
		}

		try {
			setSubmittingWeek(true)
			clearMessages()

			const payload = {
				league_id: Number(weekFormData.league_id),
				week_label: weekFormData.week_label.trim(),
				week_date: weekFormData.week_date || null,
			}

			if (editingWeekId) {
				const updatedWeek = await updateLeagueWeek(
					editingWeekId,
					payload,
				)

				setWeeks(previousWeeks =>
					sortWeeks(
						previousWeeks.map(week =>
							week.id === editingWeekId
								? updatedWeek
								: week,
						),
					),
				)

				setSelectedLeagueId(
					String(updatedWeek.league_id),
				)
				setSelectedWeekId(updatedWeek.id)

				setSuccessMessage(
					'Weekly entry updated successfully.',
				)
			} else {
				const newWeek =
					await createLeagueWeek(payload)

				setWeeks(previousWeeks =>
					sortWeeks([newWeek, ...previousWeeks]),
				)

				setSelectedLeagueId(
					String(newWeek.league_id),
				)
				setSelectedWeekId(newWeek.id)

				setSuccessMessage(
					'Weekly entry created successfully.',
				)
			}

			resetWeekForm(String(payload.league_id))
		} catch (error) {
			setErrorMessage(
				`Error ${
					editingWeekId ? 'updating' : 'creating'
				} weekly entry: ${error.message}`,
			)

			setSuccessMessage('')
		} finally {
			setSubmittingWeek(false)
		}
	}

	async function handleDeleteWeek(week) {
		const confirmed = window.confirm(
			`Delete "${week.week_label}" for ${
				week.leagues?.name || 'this league'
			}?\n\nAll player scores for this week will also be deleted.`,
		)

		if (!confirmed) {
			return
		}

		try {
			clearMessages()

			await deleteLeagueWeek(week.id)

			const remainingWeeks = sortWeeks(
				weeks.filter(item => item.id !== week.id),
			)

			setWeeks(remainingWeeks)

			if (selectedWeekId === week.id) {
				const replacementWeek =
					remainingWeeks.find(
						item =>
							String(item.league_id) ===
							String(selectedLeagueId),
					) ||
					remainingWeeks[0] ||
					null

				setSelectedWeekId(
					replacementWeek?.id ?? null,
				)
				setPlayerScores([])
				resetScoreForm()
			}

			if (editingWeekId === week.id) {
				resetWeekForm()
			}

			setSuccessMessage(
				'Weekly entry deleted successfully.',
			)
		} catch (error) {
			setErrorMessage(
				`Error deleting weekly entry: ${error.message}`,
			)

			setSuccessMessage('')
		}
	}

	async function handleScoreSubmit(event) {
		event.preventDefault()

		if (!selectedWeekId) {
			setErrorMessage(
				'Please select a weekly entry first.',
			)
			setSuccessMessage('')
			return
		}

		if (!scoreFormData.player_name.trim()) {
			setErrorMessage('Player name is required.')
			setSuccessMessage('')
			return
		}

		const average = normalizeNumber(
			scoreFormData.average,
		)
		const game1 = normalizeNumber(scoreFormData.game1)
		const game2 = normalizeNumber(scoreFormData.game2)
		const game3 = normalizeNumber(scoreFormData.game3)
		const series = normalizeNumber(scoreFormData.series)

		const displayOrder =
			normalizeNumber(scoreFormData.display_order) ?? 0

		const gamesEntered = [game1, game2, game3].filter(
			game => game !== null,
		).length

		if (gamesEntered === 0) {
			setErrorMessage(
				'Enter at least one game score.',
			)
			setSuccessMessage('')
			return
		}

		try {
			setSubmittingScore(true)
			clearMessages()

			const payload = {
				league_week_id: selectedWeekId,
				player_name:
					scoreFormData.player_name.trim(),
				average,
				game1,
				game2,
				game3,
				series,
				display_order: displayOrder,
			}

			if (editingScoreId) {
				const updatedScore =
					await updatePlayerScore(
						editingScoreId,
						payload,
					)

				setPlayerScores(previousScores =>
					sortScores(
						previousScores.map(score =>
							score.id === editingScoreId
								? updatedScore
								: score,
						),
					),
				)

				setSuccessMessage(
					'Player score updated successfully.',
				)
			} else {
				const newScore =
					await createPlayerScore(payload)

				setPlayerScores(previousScores =>
					sortScores([
						...previousScores,
						newScore,
					]),
				)

				setSuccessMessage(
					'Player score added successfully.',
				)
			}

			resetScoreForm()
		} catch (error) {
			setErrorMessage(
				`Error ${
					editingScoreId ? 'updating' : 'adding'
				} player score: ${error.message}`,
			)

			setSuccessMessage('')
		} finally {
			setSubmittingScore(false)
		}
	}

	async function handleBulkSubmit(event) {
		event.preventDefault()

		if (!selectedWeekId) {
			setErrorMessage(
				'Please select a weekly entry first.',
			)
			setSuccessMessage('')
			return
		}

		const validRows = bulkRows.filter(isBulkRowValid)

		if (validRows.length === 0) {
			setErrorMessage(
				'Enter at least one valid score row before saving.',
			)
			setSuccessMessage('')
			return
		}

		try {
			setSubmittingBulk(true)
			clearMessages()

			const payload = validRows.map(row =>
				buildScorePayload(row, selectedWeekId),
			)

			const insertedRows =
				await createMultiplePlayerScores(payload)

			setPlayerScores(previousScores =>
				sortScores([
					...previousScores,
					...insertedRows,
				]),
			)

			resetBulkRows()

			setSuccessMessage(
				`${insertedRows.length} player score row(s) added successfully.`,
			)
		} catch (error) {
			setErrorMessage(
				`Error adding bulk player scores: ${error.message}`,
			)

			setSuccessMessage('')
		} finally {
			setSubmittingBulk(false)
		}
	}

	async function handleDeleteScore(score) {
		const confirmed = window.confirm(
			`Delete this score line permanently?\n\n${formatScoreLine(
				score,
			)}`,
		)

		if (!confirmed) {
			return
		}

		try {
			clearMessages()

			await deletePlayerScore(score.id)

			setPlayerScores(previousScores =>
				previousScores.filter(
					item => item.id !== score.id,
				),
			)

			if (editingScoreId === score.id) {
				handleCancelScoreEdit()
			}

			setSuccessMessage(
				'Player score deleted successfully.',
			)
		} catch (error) {
			setErrorMessage(
				`Error deleting player score: ${error.message}`,
			)

			setSuccessMessage('')
		}
	}

	const livePreview = formatScoreLine({
		player_name: scoreFormData.player_name,
		average: scoreFormData.average,
		game1: scoreFormData.game1,
		game2: scoreFormData.game2,
		game3: scoreFormData.game3,
		series: scoreFormData.series,
	})

	return (
		<section className='admin-page scores-page'>
			<div className='admin-page__header'>
				<h1>Weekly Scores</h1>

				<p>
					Create weekly league entries and add player
					score lines.
				</p>
			</div>

			<div className='admin-card'>
				<h2>
					{editingWeekId
						? 'Edit Weekly Entry'
						: 'Create Weekly Entry'}
				</h2>

				<form
					className='score-week-form'
					onSubmit={handleWeekSubmit}
				>
					<div className='form-group'>
						<label htmlFor='league_id'>League</label>

						<select
							id='league_id'
							name='league_id'
							value={weekFormData.league_id}
							onChange={handleWeekChange}
						>
							<option value=''>
								Select a league
							</option>

							{leagues.map(league => (
								<option
									key={league.id}
									value={league.id}
								>
									{league.name}
									{league.day_of_week
										? ` (${league.day_of_week})`
										: ''}
								</option>
							))}
						</select>
					</div>

					<div className='form-group'>
						<label htmlFor='week_label'>
							Week Label
						</label>

						<input
							id='week_label'
							name='week_label'
							type='text'
							value={weekFormData.week_label}
							onChange={handleWeekChange}
							placeholder='Example: April 27, 2026'
						/>
					</div>

					<div className='form-group'>
						<label htmlFor='week_date'>
							Week Date
						</label>

						<input
							id='week_date'
							name='week_date'
							type='date'
							value={weekFormData.week_date}
							onChange={handleWeekChange}
						/>
					</div>

					<div className='form-actions'>
						<button
							type='submit'
							disabled={submittingWeek}
						>
							{submittingWeek
								? 'Saving...'
								: editingWeekId
									? 'Update Weekly Entry'
									: 'Create Weekly Entry'}
						</button>

						{editingWeekId && (
							<button
								type='button'
								className='secondary-button'
								onClick={handleCancelWeekEdit}
							>
								Cancel Edit
							</button>
						)}
					</div>
				</form>
			</div>

			<div className='admin-card'>
				<div className='scores-page__week-header'>
					<div>
						<h2>Existing Weekly Entries</h2>

						<p>
							Filter by league to keep score entry
							focused.
						</p>
					</div>

					<div className='form-group scores-page__league-filter'>
						<label htmlFor='selected-league-filter'>
							League Filter
						</label>

						<select
							id='selected-league-filter'
							value={selectedLeagueId}
							onChange={handleLeagueFilterChange}
						>
							<option value=''>All leagues</option>

							{leagues.map(league => (
								<option
									key={league.id}
									value={league.id}
								>
									{league.name}
									{league.day_of_week
										? ` (${league.day_of_week})`
										: ''}
								</option>
							))}
						</select>
					</div>
				</div>

				{successMessage && (
					<p className='status-message status-message--success'>
						{successMessage}
					</p>
				)}

				{errorMessage && (
					<p className='status-message status-message--error'>
						{errorMessage}
					</p>
				)}

				{loading ? (
					<p>Loading weekly entries...</p>
				) : filteredWeeks.length === 0 ? (
					<p>
						No weekly entries found for the selected
						league.
					</p>
				) : (
					<div className='score-week-list'>
						{filteredWeeks.map(week => (
							<article
								className={`score-week-item ${
									selectedWeekId === week.id
										? 'score-week-item--selected'
										: ''
								}`}
								key={week.id}
							>
								<div className='score-week-item__info'>
									<h3>{week.week_label}</h3>

									<p>
										League:{' '}
										{week.leagues?.name ||
											'Unknown league'}
										{week.leagues?.day_of_week
											? ` (${week.leagues.day_of_week})`
											: ''}
									</p>

									<p>
										Week Date:{' '}
										{week.week_date ||
											'Not set'}
									</p>
								</div>

								<div className='score-week-item__actions'>
									<button
										type='button'
										className='secondary-button'
										onClick={() =>
											handleSelectWeek(
												week.id,
											)
										}
									>
										{selectedWeekId ===
										week.id
											? 'Selected'
											: 'Select'}
									</button>

									<button
										type='button'
										className='edit-button'
										onClick={() =>
											handleEditWeekClick(
												week,
											)
										}
									>
										Edit
									</button>

									<button
										type='button'
										className='danger-button'
										onClick={() =>
											handleDeleteWeek(
												week,
											)
										}
									>
										Delete
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</div>

			<div className='admin-card'>
				<h2>
					{editingScoreId
						? 'Edit Player Score'
						: 'Add Single Player Score'}

					{selectedWeek
						? ` — ${selectedWeek.week_label}`
						: ''}
				</h2>

				{!selectedWeek ? (
					<p>
						Select a weekly entry above to add score rows.
					</p>
				) : (
					<>
						<form
							className='player-score-form'
							onSubmit={handleScoreSubmit}
						>
							<div className='form-group'>
								<label htmlFor='player_name'>
									Player Name
								</label>

								<input
									id='player_name'
									name='player_name'
									type='text'
									value={
										scoreFormData.player_name
									}
									onChange={handleScoreChange}
									placeholder='John Doe'
								/>
							</div>

							<div className='form-group'>
								<label htmlFor='average'>
									Average
								</label>

								<input
									id='average'
									name='average'
									type='number'
									min='0'
									max='300'
									value={scoreFormData.average}
									onChange={handleScoreChange}
								/>
							</div>

							<div className='score-grid'>
								<div className='form-group'>
									<label htmlFor='game1'>
										Game 1
									</label>

									<input
										id='game1'
										name='game1'
										type='number'
										min='0'
										max='300'
										value={
											scoreFormData.game1
										}
										onChange={handleScoreChange}
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='game2'>
										Game 2
									</label>

									<input
										id='game2'
										name='game2'
										type='number'
										min='0'
										max='300'
										value={
											scoreFormData.game2
										}
										onChange={handleScoreChange}
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='game3'>
										Game 3
									</label>

									<input
										id='game3'
										name='game3'
										type='number'
										min='0'
										max='300'
										value={
											scoreFormData.game3
										}
										onChange={handleScoreChange}
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='series'>
										Series
									</label>

									<input
										id='series'
										name='series'
										type='number'
										min='0'
										max='900'
										value={
											scoreFormData.series
										}
										onChange={handleScoreChange}
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='display_order'>
										Display Order
									</label>

									<input
										id='display_order'
										name='display_order'
										type='number'
										min='0'
										value={
											scoreFormData.display_order
										}
										onChange={handleScoreChange}
									/>
								</div>
							</div>

							<div className='score-preview'>
								<h3>Preview</h3>
								<p>{livePreview}</p>
							</div>

							<div className='form-actions'>
								<button
									type='submit'
									disabled={submittingScore}
								>
									{submittingScore
										? 'Saving...'
										: editingScoreId
											? 'Update Player Score'
											: 'Add Player Score'}
								</button>

								{editingScoreId && (
									<button
										type='button'
										className='secondary-button'
										onClick={
											handleCancelScoreEdit
										}
									>
										Cancel Edit
									</button>
								)}
							</div>
						</form>

						<div className='bulk-score-entry'>
							<div className='bulk-score-entry__header'>
								<h3>Bulk Score Entry</h3>

								<p>
									Add multiple bowlers at once for
									this weekly entry.
								</p>
							</div>

							<form
								onSubmit={handleBulkSubmit}
								className='bulk-score-form'
							>
								<div className='bulk-score-list'>
									{bulkRows.map((row, index) => (
										<div
											className='bulk-score-row'
											key={row.tempId}
										>
											<div className='bulk-score-row__top'>
												<h4>
													Row {index + 1}
												</h4>

												<button
													type='button'
													className='secondary-button'
													onClick={() =>
														removeBulkRow(
															row.tempId,
														)
													}
													disabled={
														bulkRows.length ===
														1
													}
												>
													Remove
												</button>
											</div>

											<div className='bulk-score-grid'>
												<div className='form-group'>
													<label>
														Player Name
													</label>

													<input
														type='text'
														value={
															row.player_name
														}
														onChange={event =>
															handleBulkChange(
																row.tempId,
																'player_name',
																event.target
																	.value,
															)
														}
														placeholder='John Doe'
													/>
												</div>

												<div className='form-group'>
													<label>
														Average
													</label>

													<input
														type='number'
														min='0'
														max='300'
														value={
															row.average
														}
														onChange={event =>
															handleBulkChange(
																row.tempId,
																'average',
																event.target
																	.value,
															)
														}
													/>
												</div>

												<div className='form-group'>
													<label>Game 1</label>

													<input
														type='number'
														min='0'
														max='300'
														value={
															row.game1
														}
														onChange={event =>
															handleBulkChange(
																row.tempId,
																'game1',
																event.target
																	.value,
															)
														}
													/>
												</div>

												<div className='form-group'>
													<label>Game 2</label>

													<input
														type='number'
														min='0'
														max='300'
														value={
															row.game2
														}
														onChange={event =>
															handleBulkChange(
																row.tempId,
																'game2',
																event.target
																	.value,
															)
														}
													/>
												</div>

												<div className='form-group'>
													<label>Game 3</label>

													<input
														type='number'
														min='0'
														max='300'
														value={
															row.game3
														}
														onChange={event =>
															handleBulkChange(
																row.tempId,
																'game3',
																event.target
																	.value,
															)
														}
													/>
												</div>

												<div className='form-group'>
													<label>Series</label>

													<input
														type='number'
														min='0'
														max='900'
														value={
															row.series
														}
														onChange={event =>
															handleBulkChange(
																row.tempId,
																'series',
																event.target
																	.value,
															)
														}
													/>
												</div>

												<div className='form-group'>
													<label>
														Display Order
													</label>

													<input
														type='number'
														min='0'
														value={
															row.display_order
														}
														onChange={event =>
															handleBulkChange(
																row.tempId,
																'display_order',
																event.target
																	.value,
															)
														}
													/>
												</div>
											</div>

											<div className='score-preview'>
												<h3>Preview</h3>

												<p>
													{formatScoreLine(
														row,
													)}
												</p>
											</div>
										</div>
									))}
								</div>

								<div className='form-actions'>
									<button
										type='button'
										className='secondary-button'
										onClick={addBulkRow}
									>
										Add Another Row
									</button>

									<button
										type='button'
										className='secondary-button'
										onClick={resetBulkRows}
									>
										Reset Bulk Form
									</button>

									<button
										type='submit'
										disabled={submittingBulk}
									>
										{submittingBulk
											? 'Saving Bulk Scores...'
											: 'Save Bulk Scores'}
									</button>
								</div>
							</form>
						</div>

						<div className='player-score-list-wrapper'>
							<h3>Current Player Scores</h3>

							{scoreLoading ? (
								<p>Loading player scores...</p>
							) : playerScores.length === 0 ? (
								<p>No player scores added yet.</p>
							) : (
								<div className='player-score-list'>
									{playerScores.map(score => (
										<article
											className='player-score-item'
											key={score.id}
										>
											<div className='player-score-item__info'>
												<p>
													{formatScoreLine(
														score,
													)}
												</p>
											</div>

											<div className='player-score-item__actions'>
												<button
													type='button'
													className='edit-button'
													onClick={() =>
														handleEditScoreClick(
															score,
														)
													}
												>
													Edit
												</button>

												<button
													type='button'
													className='danger-button'
													onClick={() =>
														handleDeleteScore(
															score,
														)
													}
												>
													Delete
												</button>
											</div>
										</article>
									))}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</section>
	)
}