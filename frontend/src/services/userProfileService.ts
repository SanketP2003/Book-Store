import apiClient from './apiClient';
import { UserDto } from '../types/api';

/**
 * User Profile Service
 * Handles fetching current user profile information
 */
export const userProfileService = {
  /**
   * Get the current logged-in user's profile information
   * @returns Promise with user data
   */
  getCurrentUser: async (): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>('/api/auth/me');
    return response.data;
  }
};

export default userProfileService;
