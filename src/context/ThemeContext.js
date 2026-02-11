import React, { createContext, useContext, useMemo, useState } from 'react';

const lightColors = {
  background: '#f9fafb',
  card: '#ffffff',
  text: '#0f172a',
  textSecondary: '#6b7280',
  primary: '#2563eb',
  accent: '#22c55e',
  danger: '#ef4444',
  border: '#e5e7eb',
  inputBackground: '#f9fafb',
  tabBarBackground: '#ffffff',
  tabActive: '#2563eb',
  tabInactive: '#9ca3af',
};

const darkColors = {
  background: '#020617',
  card: '#020617',
  text: '#e5e7eb',
  textSecondary: '#9ca3af',
  primary: '#2563eb',
  accent: '#22c55e',
  danger: '#ef4444',
  border: '#111827',
  inputBackground: '#020617',
  tabBarBackground: '#020617',
  tabActive: '#22c55e',
  tabInactive: '#9ca3af',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  const value = useMemo(() => {
    const colors = mode === 'dark' ? darkColors : lightColors;
    return {
      mode,
      isDark: mode === 'dark',
      colors,
      setMode,
      toggleTheme: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}

