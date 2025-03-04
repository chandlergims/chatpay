import { AUTH_ENDPOINTS, TOKEN_KEY, USER_KEY } from '../config';

// Types
export interface User {
  _id: string;
  username: string;
  twitter?: string;
  solanaWallet?: string;
  isAdmin: boolean;
  token: string;
  profile?: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  confirmPassword?: string; // Used for validation only, not sent to API
  twitter?: string;
  solanaWallet?: string;
}

// Helper to store user data in localStorage
const storeUserData = (userData: User) => {
  localStorage.setItem(TOKEN_KEY, userData.token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

// Helper to remove user data from localStorage
const clearUserData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get stored user
export const getUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Register a new user
export const register = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
        twitter: userData.twitter,
        solanaWallet: userData.solanaWallet,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store user data in localStorage
    storeUserData(data);

    return data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store user data in localStorage
    storeUserData(data);

    return data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  clearUserData();
};

// Get user profile
export const getUserProfile = async (): Promise<User> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
