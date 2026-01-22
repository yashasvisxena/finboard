'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// import { createContext, useContext, useEffect, useState } from 'react';
// type Theme = 'dark' | 'light';

// type ThemeProviderProps = {
//   children: React.ReactNode;
//   defaultTheme?: Theme;
//   storageKey?: string;
// };

// type ThemeProviderState = {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// };

// const initialState: ThemeProviderState = {
//   theme: 'dark',
//   setTheme: () => null,
// };

// const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// export function ThemeProvider({
//   children,
//   defaultTheme = 'dark',
//   storageKey = 'theme',
//   ...props
// }: ThemeProviderProps) {
//   const [theme, setTheme] = useState<Theme>(defaultTheme);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
//     if (storedTheme) {
//       setTheme(storedTheme);
//       return;
//     }

//     const systemPrefersDark = window.matchMedia?.(
//       '(prefers-color-scheme: dark)'
//     ).matches;

//     setTheme(systemPrefersDark ? 'dark' : 'light');
//   }, [storageKey]);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const root = window.document.documentElement;
//     root.classList.remove('light', 'dark');
//     root.classList.add(theme);
//   }, [theme]);

//   const value = {
//     theme,
//     setTheme: (theme: Theme) => {
//       if (typeof window !== 'undefined') {
//         window.localStorage.setItem(storageKey, theme);
//       }
//       setTheme(theme);
//     },
//   };

//   return (
//     <ThemeProviderContext.Provider {...props} value={value}>
//       {children}
//     </ThemeProviderContext.Provider>
//   );
// }

// export const useTheme = () => {
//   const context = useContext(ThemeProviderContext);

//   if (context === undefined)
//     throw new Error('useTheme must be used within a ThemeProvider');

//   return context;
// };
