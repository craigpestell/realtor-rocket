'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';

import { ThemeContext } from '@/contexts/ThemeContext';

export default function ThemeSwitch() {
  const context = useContext(ThemeContext);

  // If theme context is not available, provide a fallback
  if (!context) {
    return (
      <button
        onClick={() => {
          // Fallback: toggle document class directly
          if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
          } else {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          }
        }}
        className='relative p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
        aria-label='Toggle theme'
      >
        <div className='relative w-5 h-5'>
          <SunIcon className='absolute inset-0 w-5 h-5 text-yellow-500 dark:opacity-0 opacity-100 transition-all duration-300' />
          <MoonIcon className='absolute inset-0 w-5 h-5 text-blue-400 dark:opacity-100 opacity-0 transition-all duration-300' />
        </div>
      </button>
    );
  }

  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      className='relative p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className='relative w-5 h-5'>
        {/* Sun Icon */}
        <SunIcon
          className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-75'
          }`}
        />

        {/* Moon Icon */}
        <MoonIcon
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-75'
          }`}
        />
      </div>
    </button>
  );
}
