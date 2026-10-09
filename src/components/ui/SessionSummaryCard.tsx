import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface StatItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export function SessionSummaryCard({ title, stats }: { title: string; stats: StatItem[] }) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.lg }}>
      <ThemedText variant="h3">{title}</ThemedText>
      <View style={{ gap: spacing.md }}>
        {stats.map((stat) => (
          <View key={stat.label} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.sm,
                backgroundColor: colors.background,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name={stat.icon} size={16} color={colors.accent} />
            </View>
            <ThemedText variant="body" color="secondary" style={{ flex: 1 }}>
              {stat.label}
            </ThemedText>
            <ThemedText variant="bodyMedium">{stat.value}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}
