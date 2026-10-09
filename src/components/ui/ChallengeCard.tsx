import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { StatusPill } from './StatusPill';
import { ThemedText } from './ThemedText';

interface ChallengeCardProps {
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes: number;
  icon: keyof typeof Ionicons.glyphMap;
  completed?: boolean;
  onPress: () => void;
}

export function ChallengeCard({ category, title, difficulty, estimatedMinutes, icon, completed = false, onPress }: ChallengeCardProps) {
  const { colors, spacing, radius } = useAppTheme();

  const difficultyTone = { Easy: 'success', Medium: 'warning', Hard: 'error' } as const;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        padding: spacing.lg,
        opacity: pressed ? 0.85 : 1,
      })}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <ThemedText variant="caption" color="muted">
          {category}
        </ThemedText>
        <ThemedText variant="bodyMedium" numberOfLines={2}>
          {title}
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 2 }}>
          <StatusPill label={difficulty} tone={difficultyTone[difficulty]} />
          <StatusPill label={`${estimatedMinutes} min`} />
        </View>
      </View>
      {completed ? (
        <Ionicons name="checkmark-circle" size={22} color={colors.success} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}
