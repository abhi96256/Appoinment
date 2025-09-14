import { useState, useEffect } from 'react';
import { ThemeManager } from '../utils/themeManager';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize state based on current DOM state
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    ThemeManager.init();
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    ThemeManager.toggle();
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon for light mode */}
        <svg 
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
        {/* Moon icon for dark mode */}
        <svg 
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>
    </button>
  );
};

export default DarkModeToggle;
