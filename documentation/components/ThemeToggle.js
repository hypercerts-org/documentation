import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync state with actual DOM class on mount
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle dark mode"
      type="button"
    >
      {/* Sun icon — visible in light mode */}
      <svg className="theme-toggle-sun" viewBox="0 0 20 20" fill="none" width="20" height="20">
        <path d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 5.5v-1M13.182 6.818l.707-.707M14.5 10h1M13.182 13.182l.707.707M10 15.5v-1M6.11 13.889l.708-.707M4.5 10h1M6.11 6.111l.708.707" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
      {/* Moon icon — visible in dark mode */}
      <svg className="theme-toggle-moon" viewBox="0 0 20 20" fill="none" width="20" height="20">
        <path d="M15.224 11.724a5.5 5.5 0 0 1-6.949-6.949 5.5 5.5 0 1 0 6.949 6.949Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
