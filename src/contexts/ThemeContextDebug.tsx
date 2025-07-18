'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const defaultContextValue: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('ThemeProvider useEffect: initializing theme');
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      console.log('Saved theme:', savedTheme);
      console.log('Prefers dark:', prefersDark);

      if (savedTheme) {
        setTheme(savedTheme);
        console.log('Using saved theme:', savedTheme);
      } else if (prefersDark) {
        setTheme('dark');
        console.log('Using system preference: dark');
      } else {
        setTheme('light');
        console.log('Using default theme: light');
      }
    } catch {
      console.log('Error accessing localStorage or matchMedia');
    }

    setMounted(true);
    console.log('ThemeProvider mounted');
  }, []);

  useEffect(() => {
    console.log('ThemeProvider useEffect: theme changed to', theme, 'mounted:', mounted);
    if (mounted) {
      try {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
        console.log('Applied theme class to HTML:', theme);
        console.log('HTML classes:', document.documentElement.className);
      } catch {
        console.log('Error applying theme to DOM');
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('toggleTheme called, current theme:', theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling to:', newTheme);
    setTheme(newTheme);
  };

  const handleSetTheme = (newTheme: Theme) => {
    console.log('handleSetTheme called with:', newTheme);
    setTheme(newTheme);
  };

  const contextValue = {
    theme,
    toggleTheme,
    setTheme: handleSetTheme,
  };

  console.log('ThemeProvider rendering with theme:', theme, 'mounted:', mounted);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  console.log('useTheme called, context:', context);
  return context;
}
