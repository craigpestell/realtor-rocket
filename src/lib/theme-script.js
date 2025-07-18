// Theme initialization script - runs before React hydration
(function() {
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      if (savedTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return savedTheme;
    }
    
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const theme = getInitialTheme();
  document.documentElement.classList.add(theme);
})();
