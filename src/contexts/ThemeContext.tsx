'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create context with default values to avoid undefined checks
const defaultContextValue: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {
    // Default implementation will be overridden by provider
  },
  setTheme: () => {
    // Default implementation will be overridden by provider
  },
};

export const ThemeContext =
  createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;

      if (savedTheme) {
        setTheme(savedTheme);
      } else if (prefersDark) {
        setTheme('dark');
      }
    } catch {
      // Silent error handling for environments without localStorage
    }

    setMounted(true);
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (mounted) {
      try {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
      } catch {
        // Silent error handling for SSR and environments without localStorage
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Use the context value object with the current state
  const contextValue = {
    theme,
    toggleTheme,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}