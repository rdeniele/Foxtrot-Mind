import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { Button } from './Button';
import { ThemedText } from './ThemedText';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'leaf-outline', title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.huge, paddingHorizontal: spacing.xxl, gap: spacing.md }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: radius.xl,
          backgroundColor: colors.surfaceElevated,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xs,
        }}>
        <Ionicons name={icon} size={26} color={colors.accent} />
      </View>
      <ThemedText variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText variant="body" color="secondary" style={{ textAlign: 'center' }}>
          {description}
        </ThemedText>
      )}
      {actionLabel && onAction && (
        <View style={{ marginTop: spacing.sm }}>
          <Button label={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      )}
    </View>
  );
}
