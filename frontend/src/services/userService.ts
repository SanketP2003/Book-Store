import apiClient from './apiClient';
import { UserDto } from '../types/api';

/**
 * User Service
 * Handles all user-related API calls (admin operations)
 */
export const userService = {
  /**
   * Get all users (admin only)
   * @returns Promise with list of all users
   */
  getAllUsers: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>('/api/users');
    return response.data;
  },

  /**
   * Update a user (admin only)
   * @param id User ID
   * @param userData Updated user information
   * @returns Promise with updated user
   */
  updateUser: async (id: number, userData: Partial<UserDto>): Promise<UserDto> => {
    const response = await apiClient.put<UserDto>(`/api/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete a user (admin only)
   * @param id User ID
   * @returns Promise that resolves when user is deleted
   */
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  }
};

export default userService;
