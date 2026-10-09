import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  bordered?: boolean;
  transparent?: boolean;
}

export function TopAppBar({ title, subtitle, leading, trailing, bordered = true, transparent = false }: TopAppBarProps) {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.xl,
        backgroundColor: transparent ? 'transparent' : colors.background,
        borderBottomWidth: bordered ? 1 : 0,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}>
      {leading}
      <View style={{ flex: 1 }}>
        {title && (
          <ThemedText variant="h3" numberOfLines={1}>
            {title}
          </ThemedText>
        )}
        {subtitle && (
          <ThemedText variant="caption" color="muted" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      {trailing && <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>{trailing}</View>}
    </View>
  );
}
