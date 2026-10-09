import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface ActivityTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  accent?: boolean;
}

export function ActivityTile({ icon, title, description, onPress, accent = false }: ActivityTileProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexBasis: '48%',
        flexGrow: 1,
        backgroundColor: accent ? colors.accent : colors.surfaceElevated,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.md,
        minHeight: 128,
        justifyContent: 'space-between',
        opacity: pressed ? 0.85 : 1,
      })}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.sm,
          backgroundColor: accent ? 'rgba(18,21,8,0.12)' : colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={icon} size={18} color={accent ? colors.onAccent : colors.accent} />
      </View>
      <View style={{ gap: 2 }}>
        <ThemedText variant="bodyMedium" color={accent ? 'onAccent' : 'primary'}>
          {title}
        </ThemedText>
        <ThemedText variant="caption" color={accent ? 'onAccent' : 'muted'} style={accent ? { opacity: 0.75 } : undefined}>
          {description}
        </ThemedText>
      </View>
    </Pressable>
  );
}
