import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const { colors, spacing, radius } = useAppTheme();
  const isDisabled = disabled || loading;

  const palette: Record<Variant, { bg: string; bgPressed: string; text: string; border?: string }> = {
    primary: { bg: colors.accent, bgPressed: colors.accentPressed, text: colors.onAccent },
    secondary: { bg: colors.surfaceElevated, bgPressed: colors.border, text: colors.text, border: colors.border },
    ghost: { bg: 'transparent', bgPressed: colors.surfaceElevated, text: colors.text },
    danger: { bg: colors.errorSurface, bgPressed: colors.errorSurface, text: colors.error },
  };

  const v = palette[variant];
  const height = size === 'lg' ? 56 : 48;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: pressed && !isDisabled ? v.bgPressed : v.bg,
          borderRadius: radius.md,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          paddingHorizontal: spacing.xxl,
          opacity: isDisabled && !loading ? 0.45 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <ThemedText variant="button" style={{ color: v.text }}>
            {label}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minWidth: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
