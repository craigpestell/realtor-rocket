'use client';
import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeRoot({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
