import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Change theme"
        className=" w-10 h-10 p-1 justify-center items-center flex rounded-full hover:bg-gray-500/50 dark:hover:bg-gray-100/30 dark:bg-zinc-800 bg-zinc-100"
      >
        {theme === 'light' && <Sun className="h-5 w-5" />}
        {theme === 'dark' && <Moon className="h-5 w-5" />}
        {theme === 'system' && <Monitor className="h-5 w-5" />}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-zinc-800" role="menu">
          <div className="py-1">
            <button
              onClick={() => { setTheme('light'); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              {theme === 'light' && <Check className="h-5 w-5 mr-2" />}
              <Sun className="h-5 w-5 mr-2" />
              Light
            </button>
            <button
              onClick={() => { setTheme('dark'); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              {theme === 'dark' && <Check className="h-5 w-5 mr-2" />}
              <Moon className="h-5 w-5 mr-2" />
              Dark
            </button>
            <button
              onClick={() => { setTheme('system'); setIsOpen(false); }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              {theme === 'system' && <Check className="h-5 w-5 mr-2" />}
              <Monitor className="h-5 w-5 mr-2" />
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};