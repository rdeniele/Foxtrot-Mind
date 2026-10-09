import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

type Tone = 'neutral' | 'success' | 'warning' | 'error';

interface StatusPillProps {
  label: string;
  tone?: Tone;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function StatusPill({ label, tone = 'neutral', icon }: StatusPillProps) {
  const { colors, spacing, radius } = useAppTheme();

  const toneMap: Record<Tone, { bg: string; text: string; dot: string }> = {
    neutral: { bg: colors.surfaceElevated, text: colors.textSecondary, dot: colors.textMuted },
    success: { bg: colors.successSurface, text: colors.success, dot: colors.success },
    warning: { bg: colors.surfaceElevated, text: colors.accent, dot: colors.accent },
    error: { bg: colors.errorSurface, text: colors.error, dot: colors.error },
  };
  const t = toneMap[tone];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        backgroundColor: t.bg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.pill,
      }}>
      {icon ? (
        <Ionicons name={icon} size={13} color={t.text} />
      ) : (
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.dot }} />
      )}
      <ThemedText variant="label" style={{ color: t.text }}>
        {label}
      </ThemedText>
    </View>
  );
}
