'use client';

import { useEffect, useState } from 'react';

import { ThemeProvider } from '@/contexts/ThemeContext';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by conditionally rendering
  if (!mounted) {
    // Return a placeholder with the same theme class to avoid layout shift
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <ThemeProvider>{children}</ThemeProvider>;
}
