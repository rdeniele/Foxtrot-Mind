import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, FoxCompanion, SessionSummaryCard, TextField, ThemedText } from '@/components/ui';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ReadingSummaryScreen() {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();
  const {
    correct = '0',
    total = '0',
    title = 'Your reading session',
    minutes = '5',
    concepts = '',
  } = useLocalSearchParams<{ correct?: string; total?: string; title?: string; minutes?: string; concepts?: string }>();
  const [reflection, setReflection] = useState('');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl, paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xxxl, gap: spacing.xxl }}>
      <View style={{ alignItems: 'center', gap: spacing.md }}>
        <FoxCompanion size={48} state="celebrating" />
        <ThemedText variant="h1" style={{ textAlign: 'center' }}>
          Session complete
        </ThemedText>
        <ThemedText variant="body" color="secondary" style={{ textAlign: 'center' }}>
          Nice focus. Here&apos;s what you covered.
        </ThemedText>
      </View>

      <SessionSummaryCard
        title={title}
        stats={[
          { icon: 'time-outline', label: 'Time spent reading', value: `${minutes} min` },
          { icon: 'book-outline', label: 'Content completed', value: '1 passage' },
          { icon: 'help-circle-outline', label: 'Questions answered', value: `${correct} of ${total} correct` },
          { icon: 'bulb-outline', label: 'Concepts reviewed', value: concepts || '—' },
        ]}
      />

      <View style={{ gap: spacing.sm }}>
        <ThemedText variant="h3">One thing worth remembering?</ThemedText>
        <TextField placeholder="Optional reflection…" value={reflection} onChangeText={setReflection} multiline numberOfLines={3} style={{ minHeight: 88, textAlignVertical: 'top' }} />
      </View>

      <Button label="Done" size="lg" fullWidth onPress={() => router.replace('/library')} />
    </ScrollView>
  );
}
