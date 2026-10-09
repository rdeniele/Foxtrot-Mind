import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const { colors, spacing } = useAppTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.huge, gap: spacing.md }}>
      <ActivityIndicator color={colors.accent} />
      <ThemedText variant="body" color="muted">
        {label}
      </ThemedText>
    </View>
  );
}

export function Skeleton({ width, height, radius: r = 8 }: { width: number | `${number}%`; height: number; radius?: number }) {
  const { colors } = useAppTheme();
  return <View style={{ width, height, borderRadius: r, backgroundColor: colors.surfaceElevated }} />;
}
