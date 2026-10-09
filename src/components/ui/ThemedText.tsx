import React from 'react';
import { Text, TextProps } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';

type Variant = keyof typeof typography;
type ColorRole = 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'success' | 'onAccent' | 'inherit';

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  color?: ColorRole;
}

export function ThemedText({ variant = 'body', color = 'primary', style, ...rest }: ThemedTextProps) {
  const { colors } = useAppTheme();

  const colorMap: Record<ColorRole, string | undefined> = {
    primary: colors.text,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    accent: colors.accent,
    error: colors.error,
    success: colors.success,
    onAccent: colors.onAccent,
    inherit: undefined,
  };

  return <Text style={[typography[variant], { color: colorMap[color] }, style]} {...rest} />;
}
