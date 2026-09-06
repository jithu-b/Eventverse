import React, { createContext, useContext, useState, useEffect } from 'react';

interface StudentUser {
  email: string;
  name: string;
}

interface StudentAuthContextType {
  student: StudentUser | null;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const STORAGE_KEY = 'eventverse_student';
const StudentAuthContext = createContext<StudentAuthContextType | null>(null);

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<StudentUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setStudent(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (email: string, name: string) => {
    const user = { email, name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setStudent(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudent(null);
  };

  return (
    <StudentAuthContext.Provider value={{ student, login, logout }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) throw new Error('useStudentAuth must be used within StudentAuthProvider');
  return ctx;
}
