import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

export function KeyTermCard({ term, definition }: { term: string; definition: string }) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.md,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
        padding: spacing.lg,
        gap: spacing.xs,
      }}>
      <ThemedText variant="bodyMedium" color="accent">
        {term}
      </ThemedText>
      <ThemedText variant="body" color="secondary">
        {definition}
      </ThemedText>
    </View>
  );
}
