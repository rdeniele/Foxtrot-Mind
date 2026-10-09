import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ThemedText } from '@/components/ui';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function WelcomeScreen() {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + spacing.massive,
        paddingBottom: insets.bottom + spacing.xl,
        paddingHorizontal: spacing.xxl,
        justifyContent: 'space-between',
      }}>
      <View style={{ alignItems: 'center', gap: spacing.xxl }}>
        <Image
          source={require('@/assets/images/foxtrot-logo.png')}
          style={{ width: 108, height: 108, borderRadius: 24 }}
          contentFit="cover"
        />
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <ThemedText variant="display" style={{ textAlign: 'center' }}>
            Make your time count.
          </ThemedText>
          <ThemedText variant="bodyLarge" color="secondary" style={{ textAlign: 'center', maxWidth: 320 }}>
            A private space to read, think, learn, and talk. Even offline.
          </ThemedText>
        </View>
      </View>

      <View style={{ gap: spacing.md, alignItems: 'center' }}>
        <Button label="Get started" size="lg" fullWidth onPress={() => router.push('/onboarding/goals')} />
        <ThemedText variant="caption" color="muted">
          No account required.
        </ThemedText>
      </View>
    </View>
  );
}
