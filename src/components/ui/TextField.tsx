import React, { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextField({ label, error, helperText, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const { colors, spacing, radius, typography } = useAppTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.error : focused ? colors.accent : colors.border;

  return (
    <View style={{ gap: spacing.xs }}>
      {label && (
        <ThemedText variant="label" color="secondary">
          {label}
        </ThemedText>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          typography.body,
          {
            color: colors.text,
            backgroundColor: colors.surfaceElevated,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            minHeight: 48,
          },
          style,
        ]}
        {...rest}
      />
      {(error || helperText) && (
        <ThemedText variant="caption" color={error ? 'error' : 'muted'}>
          {error ?? helperText}
        </ThemedText>
      )}
    </View>
  );
}
