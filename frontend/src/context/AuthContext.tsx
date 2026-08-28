import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('eventverse_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('eventverse_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => {
        setAuthUser(res.data.user);
        localStorage.setItem('eventverse_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('eventverse_token');
        localStorage.removeItem('eventverse_user');
        setAuthUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('eventverse_token', res.data.access_token);
    localStorage.setItem('eventverse_user', JSON.stringify(res.data.user));
    setAuthUser(res.data.user);
    return res.data.user;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register({ name, email, password, role: 'participant' });
    localStorage.setItem('eventverse_token', res.data.access_token);
    localStorage.setItem('eventverse_user', JSON.stringify(res.data.user));
    setAuthUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('eventverse_token');
    localStorage.removeItem('eventverse_user');
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
