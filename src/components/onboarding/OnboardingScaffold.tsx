import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton, ThemedText } from '@/components/ui';
import { useAppTheme } from '@/theme/ThemeProvider';

interface OnboardingScaffoldProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  canGoBack?: boolean;
}

export function OnboardingScaffold({ step, totalSteps, title, subtitle, children, footer, canGoBack = true }: OnboardingScaffoldProps) {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, gap: spacing.md }}>
        {canGoBack ? (
          <IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />
        ) : (
          <View style={{ width: 44 }} />
        )}
        <View style={{ flex: 1, flexDirection: 'row', gap: spacing.xs }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i < step ? colors.accent : colors.surfaceElevated,
              }}
            />
          ))}
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl }}>
        <ThemedText variant="h1">{title}</ThemedText>
        {subtitle && (
          <ThemedText variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
            {subtitle}
          </ThemedText>
        )}
        <View style={{ flex: 1, marginTop: spacing.xxl }}>{children}</View>
      </View>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.lg, paddingTop: spacing.md }}>{footer}</View>
    </View>
  );
}
