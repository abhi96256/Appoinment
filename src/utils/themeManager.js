// Comprehensive theme management utility
export class ThemeManager {
  static init() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Clear any existing dark classes
    document.documentElement.classList.remove('dark');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.setDarkMode();
    } else {
      this.setLightMode();
    }
  }

  static setDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }

  static setLightMode() {
    document.documentElement.classList.remove('dark');
    // Force remove any dark classes
    document.documentElement.className = document.documentElement.className.replace(/dark/g, '').trim();
    localStorage.setItem('theme', 'light');
  }

  static toggle() {
    if (document.documentElement.classList.contains('dark')) {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  static getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = document.documentElement.classList.contains('dark');
    return {
      savedTheme,
      isDark,
      actualTheme: isDark ? 'dark' : 'light',
      classes: document.documentElement.className
    };
  }

  static forceLight() {
    this.setLightMode();
  }
}
