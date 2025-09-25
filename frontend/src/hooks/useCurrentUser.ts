import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userProfileService } from '../services/userProfileService';
import { useAuth } from '@/store/auth';
import { UserDto } from '../types/api';

/**
 * Hook to fetch and manage the current logged-in user
 * @returns Current user data and loading/error states
 */
export const useCurrentUser = () => {
  const { token } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Fetch current user data with React Query
  const {
    data: currentUser,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userProfileService.getCurrentUser,
    // Only fetch if we have a token
    enabled: isAuthenticated,
    // Don't refetch on window focus to avoid unnecessary requests
    refetchOnWindowFocus: false,
    // Handle 401 errors specially
    retry: (failureCount, error: any) => {
      return error?.status !== 401 && failureCount < 2;
    }
  });

  // Update authentication state when token changes
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  return {
    currentUser,
    isLoading,
    isError,
    error,
    isAuthenticated,
    refetch
  };
};

/**
 * Higher-level hook that combines useCurrentUser with useAuth
 * for a complete authentication experience
 */
export const useAuthentication = () => {
  const { login, logout, token } = useAuth();
  const { currentUser, isLoading, isError, refetch } = useCurrentUser();

  return {
    user: currentUser,
    token,
    isAuthenticated: !!token && !!currentUser,
    isLoading,
    isError,
    login,
    logout,
    refetchUser: refetch
  };
};
