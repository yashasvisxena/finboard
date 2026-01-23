'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { memo, useCallback } from 'react';

import { Button } from '../ui/button';

export const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return (
    <Button size='icon-lg' onClick={toggleTheme}>
      <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
    </Button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
