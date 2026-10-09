import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChallengeCard, IconButton, ThemedText, TopAppBar } from '@/components/ui';
import { challenges } from '@/data/sampleContent';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ChallengeListScreen() {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar title="Challenge" subtitle="Exercise your reasoning" leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.md, paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <ThemedText variant="caption" color="muted">
          One problem at a time. Hints are there if you want them.
        </ThemedText>
        {challenges.map((c) => (
          <ChallengeCard
            key={c.id}
            category={c.category}
            title={c.title}
            difficulty={c.difficulty}
            estimatedMinutes={c.estimatedMinutes}
            icon={c.icon as keyof typeof Ionicons.glyphMap}
            onPress={() => router.push(`/challenge/${c.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
