import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { Button } from './Button';
import { ThemedText } from './ThemedText';

interface ErrorStateProps {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, retryLabel = 'Try again', onRetry }: ErrorStateProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xxl, gap: spacing.md }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.lg,
          backgroundColor: colors.errorSurface,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="alert-circle-outline" size={24} color={colors.error} />
      </View>
      <ThemedText variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText variant="body" color="secondary" style={{ textAlign: 'center' }}>
          {description}
        </ThemedText>
      )}
      {onRetry && <Button label={retryLabel} variant="secondary" onPress={onRetry} />}
    </View>
  );
}
