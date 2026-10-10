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
  accentSoft: string;
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
  coral: string;
  coralSurface: string;
  sky: string;
  skySurface: string;
  lavender: string;
  lavenderSurface: string;
}

export type ThemeMode = 'light' | 'dark';

/** A small, cheerful rotation used for category/topic variety (Explore, challenge categories). */
export const funPalette = ['accent', 'coral', 'sky', 'lavender'] as const;

export const palette: Record<ThemeMode, ColorTokens> = {
  dark: {
    background: '#101310',
    backgroundSecondary: '#181C17',
    surfaceElevated: '#20251F',
    accent: '#D8F27A',
    accentPressed: '#C3DD63',
    accentSoft: '#2B3320',
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
    coral: '#F2A77A',
    coralSurface: '#2E2017',
    sky: '#8FC8E8',
    skySurface: '#17262E',
    lavender: '#C3AEE8',
    lavenderSurface: '#241E2E',
  },
  light: {
    background: '#F7F8F3',
    backgroundSecondary: '#FFFFFF',
    surfaceElevated: '#EEF1E8',
    accent: '#607A24',
    accentPressed: '#4E651C',
    accentSoft: '#E6EED2',
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
    coral: '#C96A3C',
    coralSurface: '#FBECE2',
    sky: '#3E7A9E',
    skySurface: '#E7F2F8',
    lavender: '#7A5FA8',
    lavenderSurface: '#F1EBFA',
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
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
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
