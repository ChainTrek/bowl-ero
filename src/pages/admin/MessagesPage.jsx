import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
	getMessages,
	updateMessageReadStatus,
} from '../../services/supabase/messages'
import { formatDateTime } from '../../utils/formatDateTime'

function formatMessageStatus(isRead) {
	return isRead ? 'Read' : 'Unread'
}

function getMessageStatusBadgeClass(isRead) {
	return `message-badge ${
		isRead
			? 'message-badge--read'
			: 'message-badge--unread'
	}`
}

export default function MessagesPage() {
	const [messages, setMessages] = useState([])
	const [loading, setLoading] = useState(true)
	const [statusMessage, setStatusMessage] = useState('')
	const [updatingMessageId, setUpdatingMessageId] =
		useState(null)

	const { refreshCounts } = useOutletContext()

	useEffect(() => {
		let isMounted = true

		async function loadMessages() {
			try {
				const data = await getMessages()

				if (isMounted) {
					setMessages(data)
				}
			} catch (error) {
				if (isMounted) {
					setStatusMessage(
						`Error loading messages: ${error.message}`,
					)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadMessages()

		return () => {
			isMounted = false
		}
	}, [])

	async function handleToggleRead(message) {
		const nextReadState = !message.is_read

		try {
			setUpdatingMessageId(message.id)
			setStatusMessage('')

			const updatedMessage =
				await updateMessageReadStatus(
					message.id,
					nextReadState,
				)

			setMessages(previousMessages =>
				previousMessages.map(item =>
					item.id === message.id
						? updatedMessage
						: item,
				),
			)

			await refreshCounts()

			setStatusMessage(
				`Message marked as ${
					updatedMessage.is_read ? 'read' : 'unread'
				}.`,
			)
		} catch (error) {
			setStatusMessage(
				`Error updating message: ${error.message}`,
			)
		} finally {
			setUpdatingMessageId(null)
		}
	}

	return (
		<section className='admin-page messages-page'>
			<div className='admin-page__header'>
				<h1>Messages</h1>
				<p>
					Review visitor messages and mark them as read or
					unread.
				</p>
			</div>

			<div className='admin-card'>
				<h2>Visitor Messages</h2>

				{statusMessage && (
					<p className='status-message'>
						{statusMessage}
					</p>
				)}

				{loading ? (
					<p>Loading messages...</p>
				) : messages.length === 0 ? (
					<p>No messages found.</p>
				) : (
					<div className='message-list'>
						{messages.map(message => (
							<article
								key={message.id}
								className={`message-item ${
									message.is_read
										? 'message-item--read'
										: 'message-item--unread'
								}`}
							>
								<div className='message-item__header'>
									<div>
										<h3>
											{message.subject ||
												'No Subject'}
										</h3>

										<div className='message-item__badges'>
											<span
												className={getMessageStatusBadgeClass(
													message.is_read,
												)}
											>
												{formatMessageStatus(
													message.is_read,
												)}
											</span>

											{message.phone && (
												<span className='message-badge message-badge--contact'>
													Phone Provided
												</span>
											)}
										</div>

										<p>
											From: {message.name} (
											{message.email})
										</p>

										{message.phone && (
											<p>
												Phone:{' '}
												{message.phone}
											</p>
										)}
									</div>

									<div className='message-item__meta'>
										<p>
											{formatDateTime(
												message.created_at,
											)}
										</p>
									</div>
								</div>

								<div className='message-item__body'>
									<p>{message.message}</p>
								</div>

								<div className='message-item__actions'>
									<button
										type='button'
										className={
											message.is_read
												? 'secondary-button'
												: 'edit-button'
										}
										onClick={() =>
											handleToggleRead(
												message,
											)
										}
										disabled={
											updatingMessageId ===
											message.id
										}
									>
										{updatingMessageId ===
										message.id
											? 'Saving...'
											: message.is_read
												? 'Mark Unread'
												: 'Mark Read'}
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	)
}