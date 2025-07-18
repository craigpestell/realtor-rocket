'use client';

import React, { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeSwitcher';

export function ClientThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 rounded-md">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  return <ThemeToggle />;
}
