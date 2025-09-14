// Utility function to reset theme to light mode
export const resetThemeToLight = () => {
  localStorage.setItem('theme', 'light');
  document.documentElement.classList.remove('dark');
  // Force remove any dark-related classes
  document.documentElement.className = document.documentElement.className.replace(/dark/g, '').trim();
  console.log('Theme reset to light mode');
  console.log('Current classes after reset:', document.documentElement.className);
};

// Utility function to force dark mode
export const forceDarkMode = () => {
  localStorage.setItem('theme', 'dark');
  document.documentElement.classList.add('dark');
  console.log('Theme forced to dark mode');
};

// Utility function to get current theme
export const getCurrentTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const isDark = document.documentElement.classList.contains('dark');
  return {
    savedTheme,
    isDark,
    actualTheme: isDark ? 'dark' : 'light'
  };
};
