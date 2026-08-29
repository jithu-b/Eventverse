import React, { createContext, useContext, useState } from 'react';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  loading: boolean;
  loginAsAdmin: () => void;
  logout: () => void;
}

const DEMO_ADMIN: AuthUser = {
  id: 1,
  name: 'Jithu Biju',
  email: 'admin@tinkerhub.sbce',
  role: 'admin',
};

const DEMO_VISITOR: AuthUser = {
  id: 0,
  name: 'Guest',
  email: 'guest@tinkerhub.sbce',
  role: 'participant',
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser>(() => {
    const stored = localStorage.getItem('eventverse_demo_role');
    return stored === 'admin' ? DEMO_ADMIN : DEMO_VISITOR;
  });

  const loginAsAdmin = () => {
    localStorage.setItem('eventverse_demo_role', 'admin');
    setAuthUser(DEMO_ADMIN);
  };

  const logout = () => {
    localStorage.removeItem('eventverse_demo_role');
    setAuthUser(DEMO_VISITOR);
  };

  return (
    <AuthContext.Provider value={{ authUser, loading: false, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
