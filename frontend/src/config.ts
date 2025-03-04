// Environment-specific configuration
const isDevelopment = import.meta.env.MODE === 'development';

// API URL based on environment
const API_URL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : '/api'; // In production, use relative path

// Auth endpoints
const AUTH_ENDPOINTS = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  PROFILE: `${API_URL}/auth/profile`,
};

// Profile endpoints
const PROFILE_ENDPOINTS = {
  CREATE_UPDATE: `${API_URL}/profiles`,
  MY_PROFILE: `${API_URL}/profiles/me`,
  ALL_PROFILES: `${API_URL}/profiles`,
  USER_PROFILE: (userId: string) => `${API_URL}/profiles/user/${userId}`,
  CHAT_RECORDS: (profileId: string) => `${API_URL}/profiles/${profileId}/chat-records`,
};

// Message endpoints
const MESSAGE_ENDPOINTS = {
  SEND: `${API_URL}/messages`,
  INBOX: `${API_URL}/messages/inbox`,
  SENT: `${API_URL}/messages/sent`,
  UNREAD_COUNT: `${API_URL}/messages/unread/count`,
  GET_MESSAGE: (id: string) => `${API_URL}/messages/${id}`,
  DELETE_MESSAGE: (id: string) => `${API_URL}/messages/${id}`,
};

// Token storage key
const TOKEN_KEY = 'chatr_auth_token';

// User storage key
const USER_KEY = 'chatr_user';

export {
  API_URL,
  AUTH_ENDPOINTS,
  PROFILE_ENDPOINTS,
  MESSAGE_ENDPOINTS,
  TOKEN_KEY,
  USER_KEY,
  isDevelopment,
};
