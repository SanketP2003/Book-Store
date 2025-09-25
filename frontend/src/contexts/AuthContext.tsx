import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserDto } from '../services/api';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function inferRole(u: any): 'ADMIN' | 'USER' | undefined {
  if (!u) return undefined;
  // Accept role as string or arrays of roles/authorities
  const roleStr = (u.role || u.authority || '').toString().toUpperCase();
  const arr = ([] as any[])
    .concat(u.roles || [])
    .concat(u.authorities || [])
    .map((r) => (typeof r === 'string' ? r : r?.role || r?.authority || ''))
    .filter(Boolean)
    .map((s: string) => s.toUpperCase());
  const pool = [roleStr, ...arr];
  if (pool.some((r) => r.includes('ADMIN'))) return 'ADMIN';
  if (pool.some((r) => r.includes('USER'))) return 'USER';
  return undefined;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser);
        const role = inferRole(parsed);
        setToken(storedToken);
        setUser(role ? { ...parsed, role } : parsed);
      }
    } catch (error) {
      console.error('Failed to parse auth data from localStorage', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const login = (newToken: string, newUser: any) => {
    const role = inferRole(newUser);
    const normalized = role ? { ...newUser, role } : newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(normalized));
    setToken(newToken);
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
