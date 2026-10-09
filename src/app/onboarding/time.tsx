import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { Button, ThemedText } from '@/components/ui';
import { timeOptions } from '@/data/sampleContent';
import { useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function TimeScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const { timePreference, setTimePreference } = useAppState();
  const [selected, setSelected] = useState<string | null>(timePreference);

  return (
    <OnboardingScaffold
      step={2}
      totalSteps={4}
      title="How much time do you usually have?"
      footer={
        <Button
          label="Continue"
          size="lg"
          fullWidth
          disabled={!selected}
          onPress={() => {
            if (selected) setTimePreference(selected);
            router.push('/onboarding/companion');
          }}
        />
      }>
      <View style={{ gap: spacing.md }}>
        {timeOptions.map((option) => {
          const isSelected = selected === option;
          return (
            <Pressable
              key={option}
              onPress={() => setSelected(option)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xl,
                borderRadius: radius.lg,
                backgroundColor: isSelected ? colors.accent : colors.surfaceElevated,
              }}>
              <ThemedText variant="bodyLarge" color={isSelected ? 'onAccent' : 'primary'}>
                {option}
              </ThemedText>
              {isSelected && (
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.onAccent, opacity: 0.25 }} />
              )}
            </Pressable>
          );
        })}
      </View>
    </OnboardingScaffold>
  );
}
