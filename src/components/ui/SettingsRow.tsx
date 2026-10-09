import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Switch, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface SettingsRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  value?: string;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export function SettingsRow({
  icon,
  label,
  description,
  value,
  switchValue,
  onSwitchChange,
  onPress,
  destructive = false,
  disabled = false,
}: SettingsRowProps) {
  const { colors, spacing } = useAppTheme();
  const isSwitch = switchValue !== undefined;

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md + 2,
        paddingHorizontal: spacing.xl,
        gap: spacing.md,
        opacity: disabled ? 0.45 : 1,
      }}>
      {icon && (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: colors.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={icon} size={17} color={destructive ? colors.error : colors.textSecondary} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <ThemedText variant="bodyMedium" color={destructive ? 'error' : 'primary'}>
          {label}
        </ThemedText>
        {description && (
          <ThemedText variant="caption" color="muted">
            {description}
          </ThemedText>
        )}
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={disabled}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={colors.backgroundSecondary}
        />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {value && (
            <ThemedText variant="body" color="muted">
              {value}
            </ThemedText>
          )}
          {onPress && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
        </View>
      )}
    </View>
  );

  if (isSwitch || !onPress) return content;

  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => ({ backgroundColor: pressed ? colors.surfaceElevated : 'transparent' })}>
      {content}
    </Pressable>
  );
}
