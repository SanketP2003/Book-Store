import apiClient, { setAuthToken, removeAuthToken } from './apiClient';
import { AuthResponse, LoginRequest, UserRegistrationRequest } from '../types/api';

/**
 * Authentication Service
 * Handles all authentication related API calls
 */
export const authService = {
  /**
   * Register a new user
   * @param userData User registration information
   * @returns Promise with auth response (token + user)
   */
  register: async (userData: UserRegistrationRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    // Store the JWT token after successful registration
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Login with email and password
   * @param credentials Login credentials (email + password)
   * @returns Promise with auth response (token + user)
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    // Store the JWT token after successful login
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Logout the current user
   * @returns Promise with logout response
   */
  logout: async (): Promise<void> => {
    try {
      // Call the logout endpoint if backend requires it
      await apiClient.post('/api/auth/logout');
    } finally {
      // Always remove the token regardless of API call result
      removeAuthToken();
    }
  },

  /**
   * Check if user is currently authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  }
};

export default authService;
