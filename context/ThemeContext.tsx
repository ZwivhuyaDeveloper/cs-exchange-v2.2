"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [isInitialized, setIsInitialized] = useState(false); // Track initialization

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Determine actual theme to apply
    let appliedTheme: ResolvedTheme;
    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      appliedTheme = theme;
    }
    
    // Apply theme class
    root.classList.add(appliedTheme);
    setResolvedTheme(appliedTheme);
    
    // Store preference
    localStorage.setItem('theme', theme);
    setIsInitialized(true); // Mark as initialized
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {

    if (!isInitialized) return; // Only after initialization
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = () => {
      if (theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        setResolvedTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Initialize on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setIsInitialized(true); // Initialize even if no stored theme
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};