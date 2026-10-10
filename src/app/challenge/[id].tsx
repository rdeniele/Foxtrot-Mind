import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, FoxCompanion, IconButton, ProgressBar, StatusPill, ThemedText, TopAppBar } from '@/components/ui';
import { challenges } from '@/data/sampleContent';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const challenge = challenges.find((c) => c.id === id) ?? challenges[0];

  const [hintsShown, setHintsShown] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === challenge.correctIndex;

  const reset = () => {
    setHintsShown(0);
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar
        title={challenge.category}
        subtitle={challenge.difficulty}
        leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl, paddingBottom: insets.bottom + spacing.xxxl }}>
        <ProgressBar value={1} label="Problem 1 of 1" />

        <View style={{ gap: spacing.sm }}>
          <ThemedText variant="h2">{challenge.title}</ThemedText>
          <ThemedText variant="bodyLarge" color="secondary">
            {challenge.prompt}
          </ThemedText>
        </View>

        <View style={{ gap: spacing.sm }}>
          {challenge.answerOptions.map((option, i) => {
            const selectedThis = selected === i;
            const correctReveal = submitted && i === challenge.correctIndex;
            const wrongReveal = submitted && selectedThis && i !== challenge.correctIndex;
            return (
              <Pressable
                key={option}
                disabled={submitted}
                onPress={() => setSelected(i)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.lg,
                  borderRadius: radius.lg,
                  backgroundColor: correctReveal ? colors.successSurface : wrongReveal ? colors.errorSurface : selectedThis ? colors.surfaceElevated : 'transparent',
                  borderWidth: 1,
                  borderColor: correctReveal ? colors.success : wrongReveal ? colors.error : selectedThis ? colors.accent : colors.border,
                }}>
                <ThemedText variant="body" style={{ flex: 1 }} color={correctReveal ? 'success' : wrongReveal ? 'error' : 'primary'}>
                  {option}
                </ThemedText>
                {correctReveal && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
                {wrongReveal && <Ionicons name="close-circle" size={18} color={colors.error} />}
              </Pressable>
            );
          })}
        </View>

        {!submitted && (
          <View style={{ gap: spacing.sm }}>
            {challenge.hints.slice(0, hintsShown).map((hint, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surfaceElevated, borderRadius: radius.md, padding: spacing.md }}>
                <StatusPill label={`Hint ${i + 1}`} />
                <ThemedText variant="body" color="secondary" style={{ flex: 1 }}>
                  {hint}
                </ThemedText>
              </View>
            ))}
            {hintsShown < challenge.hints.length && (
              <Button label={hintsShown === 0 ? 'Show a hint' : 'Show another hint'} variant="ghost" onPress={() => setHintsShown((h) => h + 1)} />
            )}
          </View>
        )}

        {submitted && (
          <View style={{ flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg }}>
            <FoxCompanion size={32} state={isCorrect ? 'celebrating' : 'encouraging'} />
            <View style={{ flex: 1, gap: spacing.xs }}>
              <ThemedText variant="bodyMedium">{isCorrect ? 'Correct.' : "Not quite — here's the reasoning."}</ThemedText>
              <ThemedText variant="body" color="secondary">
                {challenge.explanation}
              </ThemedText>
            </View>
          </View>
        )}

        {submitted ? (
          <View style={{ gap: spacing.sm }}>
            <Button label="Try another challenge" size="lg" fullWidth onPress={() => router.replace('/challenge')} />
            <Button label="Try again" variant="ghost" fullWidth onPress={reset} />
          </View>
        ) : (
          <Button label="Submit answer" size="lg" fullWidth disabled={selected === null} onPress={() => setSubmitted(true)} />
        )}
      </ScrollView>
    </View>
  );
}
