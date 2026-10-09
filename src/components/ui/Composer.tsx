import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

interface ComposerProps {
  onSend: (text: string) => void;
  isGenerating?: boolean;
  onStop?: () => void;
  placeholder?: string;
}

export function Composer({ onSend, isGenerating = false, onStop, placeholder = 'Message Foxtrot Mind…' }: ComposerProps) {
  const { colors, spacing, radius } = useAppTheme();
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.xl,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm + 2,
          maxHeight: 120,
          justifyContent: 'center',
        }}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline
          style={{ color: colors.text, fontSize: 15, lineHeight: 21, maxHeight: 100 }}
        />
      </View>
      {isGenerating ? (
        <Pressable
          onPress={onStop}
          accessibilityLabel="Stop generating"
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.pill,
            backgroundColor: colors.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="stop" size={18} color={colors.text} />
        </Pressable>
      ) : (
        <Pressable
          onPress={handleSend}
          disabled={!value.trim()}
          accessibilityLabel="Send message"
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.pill,
            backgroundColor: value.trim() ? colors.accent : colors.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="arrow-up" size={19} color={value.trim() ? colors.onAccent : colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}
