import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet, Button, EmptyState, FoxCompanion, IconButton, ProgressBar, StatusPill, ThemedText, TopAppBar } from '@/components/ui';
import { readingContent } from '@/data/readingContent';
import { useAppTheme } from '@/theme/ThemeProvider';

type Phase = 'reading' | 'comprehension';
type FontSize = 'sm' | 'md' | 'lg';

const fontSizeMap: Record<FontSize, number> = { sm: 16, md: 18, lg: 21 };

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [phase, setPhase] = useState<Phase>('reading');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [relaxedSpacing, setRelaxedSpacing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const content = id ? readingContent[id] : undefined;

  if (!content) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <TopAppBar title="Not found" leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />} />
        <EmptyState icon="book-outline" title="This passage isn't available" description="It may have been removed. Try another title from your library." />
      </View>
    );
  }

  const comprehensionQuestions = content.questions;
  const question = comprehensionQuestions[qIndex];

  const submitAnswer = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === question.correctIndex) setCorrectCount((c) => c + 1);
  };

  const nextQuestion = () => {
    if (qIndex + 1 < comprehensionQuestions.length) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      router.replace({
        pathname: '/reading/summary',
        params: {
          correct: String(correctCount),
          total: String(comprehensionQuestions.length),
          title: content.title,
          minutes: String(content.estimatedMinutes),
          concepts: content.concepts.join(', '),
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar
        title={phase === 'reading' ? content.title : 'Comprehension check'}
        subtitle={phase === 'reading' ? content.author : `Question ${qIndex + 1} of ${comprehensionQuestions.length}`}
        leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />}
        trailing={
          phase === 'reading' ? (
            <>
              <IconButton name={bookmarked ? 'bookmark' : 'bookmark-outline'} accessibilityLabel="Bookmark" onPress={() => setBookmarked((b) => !b)} />
              <IconButton name="options-outline" accessibilityLabel="Reading settings" onPress={() => setSettingsOpen(true)} />
            </>
          ) : undefined
        }
      />

      {phase === 'reading' ? (
        <>
          <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}>
            <ProgressBar value={0.42} />
          </View>
          <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg }} showsVerticalScrollIndicator={false}>
            {content.paragraphs.map((p, i) => (
              <ThemedText
                key={i}
                variant="bodyLarge"
                style={{ fontSize: fontSizeMap[fontSize], lineHeight: fontSizeMap[fontSize] * (relaxedSpacing ? 1.75 : 1.5) }}>
                {p}
              </ThemedText>
            ))}
            <Button label="Finish & reflect" size="lg" fullWidth onPress={() => setPhase('comprehension')} />
          </ScrollView>
        </>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl, paddingBottom: insets.bottom + spacing.xxl }}>
          <View style={{ paddingHorizontal: 0 }}>
            <ProgressBar value={(qIndex + (revealed ? 1 : 0)) / comprehensionQuestions.length} />
          </View>
          <StatusPill label={question.kind} tone="neutral" />
          <ThemedText variant="h2">{question.prompt}</ThemedText>

          <View style={{ gap: spacing.sm }}>
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = revealed && i === question.correctIndex;
              const isWrongSelected = revealed && isSelected && i !== question.correctIndex;
              return (
                <Pressable
                  key={option}
                  disabled={revealed}
                  onPress={() => setSelected(i)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: spacing.lg,
                    borderRadius: radius.lg,
                    backgroundColor: isCorrect ? colors.successSurface : isWrongSelected ? colors.errorSurface : isSelected ? colors.surfaceElevated : 'transparent',
                    borderWidth: 1,
                    borderColor: isCorrect ? colors.success : isWrongSelected ? colors.error : isSelected ? colors.accent : colors.border,
                  }}>
                  <ThemedText variant="body" color={isCorrect ? 'success' : isWrongSelected ? 'error' : 'primary'} style={{ flex: 1 }}>
                    {option}
                  </ThemedText>
                  {isCorrect && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
                  {isWrongSelected && <Ionicons name="close-circle" size={18} color={colors.error} />}
                </Pressable>
              );
            })}
          </View>

          {revealed && (
            <View style={{ flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg }}>
              <FoxCompanion size={32} state={selected === question.correctIndex ? 'celebrating' : 'encouraging'} />
              <View style={{ flex: 1, gap: spacing.xs }}>
                <ThemedText variant="bodyMedium">{selected === question.correctIndex ? 'Nice work.' : "Not quite — here's the idea."}</ThemedText>
                <ThemedText variant="body" color="secondary">
                  {question.explanation}
                </ThemedText>
              </View>
            </View>
          )}

          <Button
            label={revealed ? (qIndex + 1 < comprehensionQuestions.length ? 'Next question' : 'See summary') : 'Submit answer'}
            size="lg"
            fullWidth
            disabled={selected === null}
            onPress={revealed ? nextQuestion : submitAnswer}
          />
        </ScrollView>
      )}

      <BottomSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} title="Reading settings">
        <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.xl }}>
          <View style={{ gap: spacing.sm }}>
            <ThemedText variant="label" color="secondary">
              TEXT SIZE
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {(['sm', 'md', 'lg'] as FontSize[]).map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setFontSize(size)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: spacing.md,
                    borderRadius: radius.md,
                    backgroundColor: fontSize === size ? colors.accent : colors.surfaceElevated,
                  }}>
                  <ThemedText variant="bodyMedium" color={fontSize === size ? 'onAccent' : 'primary'} style={{ fontSize: fontSizeMap[size] }}>
                    Aa
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText variant="bodyMedium">Relaxed line spacing</ThemedText>
            <Pressable
              onPress={() => setRelaxedSpacing((v) => !v)}
              style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: relaxedSpacing ? colors.accent : colors.surfaceElevated }}>
              <ThemedText variant="captionMedium" color={relaxedSpacing ? 'onAccent' : 'secondary'}>
                {relaxedSpacing ? 'On' : 'Off'}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
