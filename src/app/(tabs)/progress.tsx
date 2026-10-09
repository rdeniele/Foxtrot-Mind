import React from 'react';
import { ScrollView, View } from 'react-native';

import { ProgressBar, ThemedText, TopAppBar } from '@/components/ui';
import { skillAreas, weeklyActivity } from '@/data/sampleContent';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ProgressScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const maxMinutes = Math.max(...weeklyActivity.map((d) => d.minutes), 1);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopAppBar title="Progress" subtitle="Your practice, not a performance review" />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xxl, paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {[
            { label: 'Reading time', value: '2h 14m' },
            { label: 'Challenges completed', value: '11' },
            { label: 'Comprehension exercises', value: '8' },
            { label: 'Writing sessions', value: '3' },
          ].map((stat) => (
            <View key={stat.label} style={{ flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg, gap: 4 }}>
              <ThemedText variant="h2">{stat.value}</ThemedText>
              <ThemedText variant="caption" color="muted">
                {stat.label}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={{ gap: spacing.lg }}>
          <ThemedText variant="h3">This week</ThemedText>
          <ThemedText variant="body" color="secondary">
            You completed four reading sessions and three challenges this week.
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, height: 90 }}>
            {weeklyActivity.map((d) => (
              <View key={d.day} style={{ flex: 1, alignItems: 'center', gap: spacing.xs }}>
                <View
                  style={{
                    width: '100%',
                    height: Math.max(6, (d.minutes / maxMinutes) * 64),
                    borderRadius: 6,
                    backgroundColor: d.minutes > 0 ? colors.accent : colors.surfaceElevated,
                  }}
                />
                <ThemedText variant="label" color="muted">
                  {d.day}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: spacing.lg }}>
          <ThemedText variant="h3">Skill areas</ThemedText>
          <ThemedText variant="caption" color="muted">
            Personal practice indicators, not a validated intelligence measurement.
          </ThemedText>
          <View style={{ gap: spacing.md }}>
            {skillAreas.map((skill) => (
              <ProgressBar key={skill.label} label={skill.label} value={skill.value} trailingLabel={`${Math.round(skill.value * 100)}%`} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
