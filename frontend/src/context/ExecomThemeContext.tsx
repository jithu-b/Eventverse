import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'blush' | 'minimalist';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isBlush: boolean;
}

const THEME_STORAGE_KEY = 'exicom_selected_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ExecomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'minimalist' || saved === 'blush') {
        return saved;
      }
    } catch {}
    return 'blush';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {}
  };

  const toggleTheme = () => setTheme(theme === 'blush' ? 'minimalist' : 'blush');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'minimalist') {
      document.documentElement.classList.add('theme-minimalist');
      document.documentElement.classList.remove('theme-blush');
    } else {
      document.documentElement.classList.add('theme-blush');
      document.documentElement.classList.remove('theme-minimalist');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isBlush: theme === 'blush' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useExecomTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useExecomTheme must be used within ExecomThemeProvider');
  return context;
};
