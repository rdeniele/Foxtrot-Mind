import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface MemoryChipProps {
  label: string;
  category: string;
  onPress?: () => void;
  onRemove?: () => void;
}

export function MemoryChip({ label, category, onPress, onRemove }: MemoryChipProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
      <View style={{ gap: 1 }}>
        <ThemedText variant="caption" color="muted">
          {category}
        </ThemedText>
        <ThemedText variant="bodyMedium" numberOfLines={1} style={{ maxWidth: 200 }}>
          {label}
        </ThemedText>
      </View>
      {onRemove && (
        <Pressable onPress={onRemove} accessibilityLabel="Remove memory" hitSlop={8}>
          <Ionicons name="close" size={15} color={colors.textMuted} />
        </Pressable>
      )}
    </Pressable>
  );
}
