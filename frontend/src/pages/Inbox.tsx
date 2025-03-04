import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInboxMessages, getSentMessages, deleteMessage, Message } from '../services/messageService';
import { isAuthenticated } from '../services/authService';
import MessageModal from '../components/MessageModal';
import './Pages.css';
import './Inbox.css';

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  // Fetch messages on component mount and when tab changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!isAuthenticated()) {
        navigate('/');
        toast.error('You must be logged in to view messages');
        return;
      }

      try {
        setIsLoading(true);
        let fetchedMessages: Message[];

        if (activeTab === 'inbox') {
          fetchedMessages = await getInboxMessages();
        } else {
          fetchedMessages = await getSentMessages();
        }

        setMessages(fetchedMessages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [activeTab, navigate]);

  const handleDeleteMessage = async (id: string) => {
    try {
      setDeletingMessageId(id);
      await deleteMessage(id);
      setMessages(messages.filter(message => message._id !== id));
      toast.success('Message declined');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline message';
      toast.error(errorMessage);
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="page-container">

      <div className="mailbox-container">
        <div className="inbox-header">
          <div className="inbox-tabs">
            <button
              className={`inbox-tab ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('inbox')}
            >
              Inbox
            </button>
            <button
              className={`inbox-tab ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading">Loading messages...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error">{error}</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages found.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map(message => (
              <div
                key={message._id}
                className={`message-item ${!message.isRead && activeTab === 'inbox' ? 'unread' : ''}`}
              >
                <div className="message-checkbox">
                  <input type="checkbox" />
                </div>
                <div className="message-star">★</div>
                <div className="message-content-preview">
                  <span className="message-from">
                    {activeTab === 'inbox' ? message.sender.username : message.recipient.username}
                  </span>
                  <div className="message-subject-line">
                    <span className="message-subject">{message.subject}</span>
                    <span className="message-preview">
                      {message.content.length > 50 
                        ? `${message.content.substring(0, 50)}...` 
                        : message.content}
                    </span>
                  </div>
                </div>
                <div className="message-metadata">
                  <span className="message-date">{formatDate(message.createdAt)}</span>
                  <div className="message-actions">
                    {activeTab === 'inbox' && (
                      <>
                        <button
                          className="reply-button"
                          onClick={() => handleReply(message)}
                        >
                          Reply
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteMessage(message._id)}
                          disabled={deletingMessageId === message._id}
                        >
                          {deletingMessageId === message._id ? 'Declining...' : 'Decline'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMessage && (
        <MessageModal
          isOpen={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          recipientId={selectedMessage.sender._id}
          recipientName={selectedMessage.sender.username}
          replyTo={selectedMessage._id}
          replySubject={selectedMessage.subject}
        />
      )}
    </div>
  );
};

export default Inbox;
