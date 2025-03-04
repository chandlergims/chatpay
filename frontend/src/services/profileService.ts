import { PROFILE_ENDPOINTS } from '../config';
import { getToken } from './authService';

// Interface for chat record
export interface ChatRecord {
  date: string;
  count: number;
}

// Types
export interface Profile {
  _id: string;
  user: string;
  name: string;
  bio: string;
  avatar: string;
  chatPrice: number;
  isActive: boolean;
  earnings: number;
  chatsReceived: number;
  dailyChats: Record<string, number>;
  previousWeekChats: number;
  currentWeekChats: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFormData {
  name: string;
  bio?: string;
  avatar?: string;
  chatPrice?: number;
  twitter?: string;
}

// Create or update profile
export const createOrUpdateProfile = async (profileData: ProfileFormData): Promise<Profile> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(PROFILE_ENDPOINTS.CREATE_UPDATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create/update profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get current user profile
export const getMyProfile = async (): Promise<Profile | null> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(PROFILE_ENDPOINTS.MY_PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // If profile not found, return null
    if (response.status === 404) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Interface for pagination
export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

// Interface for profile response
export interface ProfilesResponse {
  profiles: Profile[];
  pagination: Pagination;
}

// Get profiles with search and pagination
export const getProfiles = async (
  search?: string,
  filter?: string,
  page: number = 1,
  limit: number = 20
): Promise<ProfilesResponse> => {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (filter) queryParams.append('filter', filter);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const url = `${PROFILE_ENDPOINTS.ALL_PROFILES}?${queryParams.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profiles');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Legacy function for backward compatibility
export const getAllProfiles = async (): Promise<Profile[]> => {
  try {
    const response = await getProfiles();
    return response.profiles;
  } catch (error) {
    throw error;
  }
};

// Get profile by user ID
export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  try {
    const response = await fetch(PROFILE_ENDPOINTS.USER_PROFILE(userId));
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Check if user has a profile
export const hasProfile = async (): Promise<boolean> => {
  try {
    const profile = await getMyProfile();
    return !!profile;
  } catch (error) {
    return false;
  }
};

// Get chat records for a profile
export const getProfileChatRecords = async (profileId: string): Promise<ChatRecord[]> => {
  try {
    const response = await fetch(PROFILE_ENDPOINTS.CHAT_RECORDS(profileId));
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get chat records');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
