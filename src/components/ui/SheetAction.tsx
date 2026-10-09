import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface SheetActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress: () => void;
}

export function SheetAction({ icon, label, description, onPress }: SheetActionProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        backgroundColor: pressed ? colors.surfaceElevated : 'transparent',
      })}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceElevated,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={icon} size={19} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText variant="bodyMedium">{label}</ThemedText>
        {description && (
          <ThemedText variant="caption" color="muted">
            {description}
          </ThemedText>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}
