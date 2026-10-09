/**
 * Foxtrot Mind design tokens.
 * Source of truth for color, spacing, radius, and elevation across the app.
 */

export interface ColorTokens {
  background: string;
  backgroundSecondary: string;
  surfaceElevated: string;
  accent: string;
  accentPressed: string;
  onAccent: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  error: string;
  errorSurface: string;
  success: string;
  successSurface: string;
}

export type ThemeMode = 'light' | 'dark';

export const palette: Record<ThemeMode, ColorTokens> = {
  dark: {
    background: '#101310',
    backgroundSecondary: '#181C17',
    surfaceElevated: '#20251F',
    accent: '#D8F27A',
    accentPressed: '#C3DD63',
    onAccent: '#121508',
    text: '#F3F4EE',
    textSecondary: '#B6BEB1',
    textMuted: '#8D9789',
    border: '#343A32',
    borderStrong: '#434A3F',
    error: '#E2897D',
    errorSurface: '#2A1C19',
    success: '#8FD19E',
    successSurface: '#17231B',
  },
  light: {
    background: '#F7F8F3',
    backgroundSecondary: '#FFFFFF',
    surfaceElevated: '#EEF1E8',
    accent: '#607A24',
    accentPressed: '#4E651C',
    onAccent: '#FBFCF7',
    text: '#1A1D18',
    textSecondary: '#555D51',
    textMuted: '#7A8274',
    border: '#DDE2D6',
    borderStrong: '#C7CDBC',
    error: '#B3463A',
    errorSurface: '#FBEAE7',
    success: '#3C7A4C',
    successSurface: '#E9F4EB',
  },
};

export type Palette = ColorTokens;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
  massive: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const touchTarget = {
  min: 44,
} as const;

export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;
