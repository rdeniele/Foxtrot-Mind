import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, FoxMark, SessionSummaryCard, TextField, ThemedText } from '@/components/ui';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ReadingSummaryScreen() {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { correct = '0', total = '0' } = useLocalSearchParams<{ correct?: string; total?: string }>();
  const [reflection, setReflection] = useState('');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl, paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xxxl, gap: spacing.xxl }}>
      <View style={{ alignItems: 'center', gap: spacing.md }}>
        <FoxMark size={48} />
        <ThemedText variant="h1" style={{ textAlign: 'center' }}>
          Session complete
        </ThemedText>
        <ThemedText variant="body" color="secondary" style={{ textAlign: 'center' }}>
          Nice focus. Here&apos;s what you covered.
        </ThemedText>
      </View>

      <SessionSummaryCard
        title="The Practice of Deep Work"
        stats={[
          { icon: 'time-outline', label: 'Time spent reading', value: '6 min' },
          { icon: 'book-outline', label: 'Content completed', value: '1 passage' },
          { icon: 'help-circle-outline', label: 'Questions answered', value: `${correct} of ${total} correct` },
          { icon: 'bulb-outline', label: 'Concepts reviewed', value: 'Focus, avoidance' },
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
