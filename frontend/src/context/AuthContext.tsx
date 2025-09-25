import { createContext, useContext, ReactNode } from 'react';
import { useAuthentication } from '../hooks/useCurrentUser';
import { UserDto } from '../types/api';

// Define the context type
interface AuthContextType {
  user: UserDto | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  refetchUser: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  login: () => {},
  logout: () => {},
  refetchUser: () => {}
});

// Provider component that wraps your app and makes auth available
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthentication();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAppAuth = () => useContext(AuthContext);
