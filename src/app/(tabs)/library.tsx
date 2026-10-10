import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton, ProgressBar, ThemedText, TopAppBar } from '@/components/ui';
import { BookItem, library, recommendedOffline } from '@/data/readingContent';
import { useAppTheme } from '@/theme/ThemeProvider';

function BookRow({ item }: { item: BookItem }) {
  const { colors, spacing, radius } = useAppTheme();
  return (
    <Pressable
      onPress={() => router.push(`/reading/${item.id}`)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg }}>
      <View style={{ width: 44, height: 58, borderRadius: 8, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText variant="label" color="muted">
          {item.kind === 'Book' ? 'BK' : item.kind === 'Article' ? 'ART' : 'SR'}
        </ThemedText>
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <ThemedText variant="bodyMedium" numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText variant="caption" color="muted" numberOfLines={1}>
          {item.author}
        </ThemedText>
        {item.progress > 0 ? (
          <ProgressBar value={item.progress} trailingLabel={`${item.minutesLeft} min left`} />
        ) : (
          <ThemedText variant="caption" color="muted">
            {item.minutesLeft} min read
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { spacing } = useAppTheme();
  return (
    <View style={{ gap: spacing.md }}>
      <ThemedText variant="h3">{title}</ThemedText>
      {children}
    </View>
  );
}

export default function LibraryScreen() {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopAppBar
        title="Library"
        subtitle="Books, articles, and your saved material"
        trailing={<IconButton name="cloud-upload-outline" accessibilityLabel="Import" onPress={() => {}} />}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xxl, paddingBottom: insets.bottom + spacing.massive }} showsVerticalScrollIndicator={false}>
        <Section title="Continue reading">
          <View style={{ gap: spacing.sm }}>
            {library.map((item) => (
              <BookRow key={item.id} item={item} />
            ))}
          </View>
        </Section>

        <Section title="Recommended offline content">
          <View style={{ gap: spacing.sm }}>
            {recommendedOffline.map((item) => (
              <BookRow key={item.id} item={item} />
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}
