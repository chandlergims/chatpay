import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { sendMessage, MessageFormData } from '../services/messageService';
import { getUser } from '../services/authService';
import './MessageModal.css';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  replyTo?: string;
  replySubject?: string;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  replyTo,
  replySubject
}) => {
  const [subject, setSubject] = useState(replySubject ? `Re: ${replySubject}` : '');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Check if user is trying to message themselves when the modal opens
  useEffect(() => {
    if (isOpen) {
      const currentUser = getUser();
      if (currentUser && currentUser._id === recipientId) {
        toast.error('You cannot send messages to yourself');
        onClose();
      }
    }
  }, [isOpen, recipientId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is trying to message themselves
    const currentUser = getUser();
    if (currentUser && currentUser._id === recipientId) {
      toast.error('You cannot send messages to yourself');
      onClose();
      return;
    }

    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setIsSending(true);

      const messageData: MessageFormData = {
        recipientId,
        subject,
        content
      };

      if (replyTo) {
        messageData.replyTo = replyTo;
      }

      await sendMessage(messageData);
      toast.success(`Message sent to ${recipientName}`);
      
      // Reset form and close modal
      setSubject('');
      setContent('');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Message to ${recipientName}`}
    >
      <form className="message-form" onSubmit={handleSubmit}>
        <div className="message-form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            required
          />
        </div>

        <div className="message-form-group">
          <label htmlFor="content">Message</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here..."
            rows={6}
            required
          />
        </div>

        <div className="message-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="send-button"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MessageModal;
