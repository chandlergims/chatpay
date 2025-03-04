import { MESSAGE_ENDPOINTS } from '../config';
import { getToken } from './authService';

// Types
export interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  recipient: {
    _id: string;
    username: string;
  };
  subject: string;
  content: string;
  isRead: boolean;
  replyTo: Message | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageFormData {
  recipientId: string;
  subject: string;
  content: string;
  replyTo?: string;
}

// Send a new message
export const sendMessage = async (messageData: MessageFormData): Promise<Message> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(MESSAGE_ENDPOINTS.SEND, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get inbox messages
export const getInboxMessages = async (): Promise<Message[]> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(MESSAGE_ENDPOINTS.INBOX, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get inbox messages');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get sent messages
export const getSentMessages = async (): Promise<Message[]> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(MESSAGE_ENDPOINTS.SENT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get sent messages');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get a single message by ID
export const getMessageById = async (id: string): Promise<Message> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(MESSAGE_ENDPOINTS.GET_MESSAGE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get message');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (id: string): Promise<void> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(MESSAGE_ENDPOINTS.DELETE_MESSAGE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete message');
    }
  } catch (error) {
    throw error;
  }
};

// Get unread message count
export const getUnreadCount = async (): Promise<number> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(MESSAGE_ENDPOINTS.UNREAD_COUNT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get unread count');
    }

    return data.count;
  } catch (error) {
    throw error;
  }
};
