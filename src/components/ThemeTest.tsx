'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeTest() {
  const { theme } = useTheme();
  
  return (
    <div className="fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
      Current theme: {theme}
    </div>
  );
}
