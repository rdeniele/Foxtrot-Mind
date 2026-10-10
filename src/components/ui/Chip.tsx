import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Pressable } from 'react-native';

import { useBouncyPress } from '@/hooks/use-bouncy-press';
import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Chip({ label, selected = false, onPress, icon }: ChipProps) {
  const { colors, spacing, radius } = useAppTheme();
  const { scale, onPressIn, onPressOut } = useBouncyPress(0.93);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm + 2,
          borderRadius: radius.pill,
          backgroundColor: selected ? colors.accent : pressed ? colors.surfaceElevated : 'transparent',
          borderWidth: 1,
          borderColor: selected ? colors.accent : colors.border,
        })}>
        {icon && <Ionicons name={icon} size={15} color={selected ? colors.onAccent : colors.textSecondary} />}
        <ThemedText variant="bodyMedium" color={selected ? 'onAccent' : 'secondary'}>
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}
