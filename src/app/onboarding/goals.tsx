import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { Button, Chip } from '@/components/ui';
import { goalOptions } from '@/data/sampleContent';
import { useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function GoalsScreen() {
  const { spacing } = useAppTheme();
  const { goals, setGoals } = useAppState();
  const [selected, setSelected] = useState<string[]>(goals);

  const toggle = (goal: string) => {
    setSelected((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  return (
    <OnboardingScaffold
      step={1}
      totalSteps={4}
      title="What would you like to improve?"
      subtitle="Select as many as you like."
      footer={
        <Button
          label="Continue"
          size="lg"
          fullWidth
          disabled={selected.length === 0}
          onPress={() => {
            setGoals(selected);
            router.push('/onboarding/time');
          }}
        />
      }>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {goalOptions.map((goal) => (
            <Chip key={goal} label={goal} selected={selected.includes(goal)} onPress={() => toggle(goal)} />
          ))}
        </View>
      </ScrollView>
    </OnboardingScaffold>
  );
}
