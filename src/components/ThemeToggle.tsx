'use client';

import { useTheme } from '@/context/ThemeContext';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Select } from './ui/select';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeIconMap = {
    light: <SunIcon className='w-4 h-4' />,
    dark: <MoonIcon className='w-4 h-4' />,
  };

  return (
    <div>
      <Select
        value={theme}
        onValueChange={(value) =>
          setTheme(value as 'light' | 'system' | 'dark')
        }
        trigger={
          <Button className='size-10'>{themeIconMap[resolvedTheme]}</Button>
        }
      >
        <option value='light'>Light</option>
        <option value='dark'>Dark</option>
        <option value='system'>System</option>
      </Select>
    </div>
  );
}
