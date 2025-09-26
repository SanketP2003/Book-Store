import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/api';

/**
 * Centralized Axios Client Configuration
 * This file creates a configured Axios instance for all API calls
 */

// Create an axios instance with our API URL from .env
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token handling helper functions
// Using 'token' to match the key in auth.ts store
const AUTH_TOKEN_KEY = 'token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Add a request interceptor to include auth token in headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Convert API errors to a consistent format
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: 'An unexpected error occurred',
    };

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      // Auth errors - log out the user
      if (status === 401) {
        // If it's not a login attempt and we get 401, clear token
        if (!error.config?.url?.includes('/api/auth')) {
          removeAuthToken();
          window.location.href = '/login';
        }
        apiError.message = 'Authentication failed. Please log in again.';
      }
      // Not found
      else if (status === 404) {
        apiError.message = 'Resource not found';
      }
      // Server error
      else if (status >= 500) {
        apiError.message = 'Server error. Please try again later.';
      }
      // Try to extract error message from response
      else if (typeof data === 'object' && data !== null) {
        if ('message' in data) {
          apiError.message = data.message as string;
        }
        if ('details' in data && Array.isArray(data.details)) {
          apiError.details = data.details;
        }
      }

      // Add request path for debugging
      apiError.path = error.config?.url ?? '';
    } else if (error.request) {
      // Request was made but no response received (network error)
      apiError.message = 'Network error. Please check your connection.';
    }

    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);

export default apiClient;
