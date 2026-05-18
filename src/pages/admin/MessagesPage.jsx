import { useEffect, useState } from 'react';
import {
  getMessages,
  updateMessageReadStatus,
} from '../../services/supabase/messages';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [updatingMessageId, setUpdatingMessageId] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      setStatusMessage(`Error loading messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleRead(message) {
    const nextReadState = !message.is_read;

    try {
      setUpdatingMessageId(message.id);
      setStatusMessage('');

      const updatedMessage = await updateMessageReadStatus(
        message.id,
        nextReadState
      );

      setMessages((prev) =>
        prev.map((item) =>
          item.id === message.id ? updatedMessage : item
        )
      );

      setStatusMessage(
        `Message marked as ${updatedMessage.is_read ? 'read' : 'unread'}.`
      );
    } catch (error) {
      setStatusMessage(`Error updating message: ${error.message}`);
    } finally {
      setUpdatingMessageId(null);
    }
  }

  return (
    <section className="admin-page messages-page">
      <div className="admin-page__header">
        <h1>Messages</h1>
        <p>Review visitor messages and mark them as read or unread.</p>
      </div>

      <div className="admin-card">
        <h2>Visitor Messages</h2>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="message-list">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`message-item ${
                  message.is_read ? 'message-item--read' : 'message-item--unread'
                }`}
              >
                <div className="message-item__header">
                  <div>
                    <h3>{message.subject || 'No Subject'}</h3>
                    <p>
                      From: {message.name} ({message.email})
                    </p>
                    {message.phone && <p>Phone: {message.phone}</p>}
                  </div>

                  <div className="message-item__meta">
                    <span className="message-badge">
                      {message.is_read ? 'Read' : 'Unread'}
                    </span>
                    <p>{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="message-item__body">
                  <p>{message.message}</p>
                </div>

                <div className="message-item__actions">
                  <button
                    type="button"
                    className={message.is_read ? 'secondary-button' : 'edit-button'}
                    onClick={() => handleToggleRead(message)}
                    disabled={updatingMessageId === message.id}
                  >
                    {updatingMessageId === message.id
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
  );
}