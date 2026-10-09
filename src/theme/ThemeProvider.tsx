import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { palette, radius, spacing, ThemeMode } from './tokens';
import { typography } from './typography';

type ThemePreference = ThemeMode | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  colors: (typeof palette)['dark'];
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const mode: ThemeMode = preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const handleSetPreference = useCallback((next: ThemePreference) => setPreference(next), []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      preference,
      setPreference: handleSetPreference,
      colors: palette[mode],
      spacing,
      radius,
      typography,
    }),
    [mode, preference, handleSetPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within a ThemeProvider');
  return ctx;
}
