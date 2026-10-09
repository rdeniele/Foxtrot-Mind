import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface ProgressBarProps {
  value: number;
  label?: string;
  trailingLabel?: string;
}

export function ProgressBar({ value, label, trailingLabel }: ProgressBarProps) {
  const { colors, spacing, radius } = useAppTheme();
  const pct = Math.max(0, Math.min(1, value));

  return (
    <View style={{ gap: spacing.xs }}>
      {(label || trailingLabel) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {label && (
            <ThemedText variant="caption" color="secondary">
              {label}
            </ThemedText>
          )}
          {trailingLabel && (
            <ThemedText variant="caption" color="muted">
              {trailingLabel}
            </ThemedText>
          )}
        </View>
      )}
      <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: colors.surfaceElevated, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: radius.pill, backgroundColor: colors.accent }} />
      </View>
    </View>
  );
}
