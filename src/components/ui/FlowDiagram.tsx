import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

export function FlowDiagram({ steps }: { steps: string[] }) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      {steps.map((step, i) => (
        <View key={i}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              backgroundColor: colors.surfaceElevated,
              borderRadius: radius.md,
              padding: spacing.md,
            }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ThemedText variant="label" color="onAccent">
                {i + 1}
              </ThemedText>
            </View>
            <ThemedText variant="body" style={{ flex: 1 }}>
              {step}
            </ThemedText>
          </View>
          {i < steps.length - 1 && (
            <View style={{ alignItems: 'center', paddingVertical: 2 }}>
              <Ionicons name="arrow-down" size={14} color={colors.textMuted} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
