import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, role }: { children: ReactNode; role?: 'USER' | 'ADMIN' }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // Debug information to see what's happening with auth
  console.log('Protected Route Check:', {
    path: location.pathname,
    requiresRole: role,
    currentUser: user,
    hasToken: !!token,
    userRole: user?.role
  });

  if (!token || !user) {
    console.log('No authentication, redirecting to login');
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back to that page after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and the user does not have it, redirect to home.
  if (role && user.role !== role) {
    console.log(`User role "${user.role}" doesn't match required role "${role}", redirecting to home`);
    return <Navigate to="/" replace />;
  }

  console.log('Access granted to protected route');
  return <>{children}</>;
}
