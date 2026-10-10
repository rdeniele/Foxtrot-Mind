import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';
import { TypingDots } from './TypingDots';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
}

export function ChatBubble({ role, text, streaming = false }: ChatBubbleProps) {
  const { colors, spacing, radius } = useAppTheme();
  const isUser = role === 'user';
  const thinking = streaming && text.length === 0;

  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '86%',
        backgroundColor: isUser ? colors.accent : colors.surfaceElevated,
        borderRadius: radius.lg,
        borderBottomRightRadius: isUser ? radius.sm : radius.lg,
        borderBottomLeftRadius: isUser ? radius.lg : radius.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        minHeight: 20,
        justifyContent: 'center',
      }}>
      {thinking ? (
        <TypingDots />
      ) : (
        <ThemedText variant="body" color={isUser ? 'onAccent' : 'primary'}>
          {text}
          {streaming ? ' ●' : ''}
        </ThemedText>
      )}
    </View>
  );
}
