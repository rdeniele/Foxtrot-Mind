import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { Button, ThemedText } from '@/components/ui';
import { companionModes, CompanionMode } from '@/data/sampleContent';
import { useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function CompanionScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const { companionMode, setCompanionMode } = useAppState();
  const [selected, setSelected] = useState<CompanionMode>(companionMode);

  return (
    <OnboardingScaffold
      step={3}
      totalSteps={4}
      title="What kind of companion do you prefer?"
      subtitle="You can switch modes anytime in Talk."
      footer={
        <Button
          label="Continue"
          size="lg"
          fullWidth
          onPress={() => {
            setCompanionMode(selected);
            router.push('/onboarding/model-setup');
          }}
        />
      }>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.md }}>
          {companionModes.map((item) => {
            const isSelected = selected === item.mode;
            return (
              <Pressable
                key={item.mode}
                onPress={() => setSelected(item.mode)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.lg,
                  borderRadius: radius.lg,
                  backgroundColor: isSelected ? colors.surfaceElevated : 'transparent',
                  borderWidth: 1,
                  borderColor: isSelected ? colors.accent : colors.border,
                }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: isSelected ? colors.accent : colors.surfaceElevated,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={19} color={isSelected ? colors.onAccent : colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="bodyMedium">{item.mode}</ThemedText>
                  <ThemedText variant="caption" color="muted">
                    {item.description}
                  </ThemedText>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </OnboardingScaffold>
  );
}
