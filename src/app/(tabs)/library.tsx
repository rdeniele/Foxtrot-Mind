import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listBookmarkedIds } from '@/ai/libraryProgress';
import { BookRow, EmptyState, ThemedText, TopAppBar } from '@/components/ui';
import { getArticle, KnowledgeArticle } from '@/data/knowledgeLibrary';
import { library } from '@/data/readingContent';
import { useAppTheme } from '@/theme/ThemeProvider';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { spacing } = useAppTheme();
  return (
    <View style={{ gap: spacing.md }}>
      <ThemedText variant="h3">{title}</ThemedText>
      {children}
    </View>
  );
}

function BookmarkedLessonRow({ article }: { article: KnowledgeArticle }) {
  const { colors, spacing, radius } = useAppTheme();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/learn/[id]', params: { id: article.id } })}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg }}>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="caption" color="muted">
          {article.subcategory ?? article.category}
        </ThemedText>
        <ThemedText variant="bodyMedium" numberOfLines={2}>
          {article.title}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [bookmarked, setBookmarked] = useState<KnowledgeArticle[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      listBookmarkedIds().then(ids => {
        setBookmarked(ids.map(getArticle).filter((a): a is KnowledgeArticle => !!a));
      });
    }, []),
  );

  const isEmpty = library.length === 0 && (bookmarked?.length ?? 0) === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopAppBar title="Library" subtitle="What you're reading and have saved" />
      {isEmpty ? (
        <EmptyState
          icon="library-outline"
          title="Nothing saved yet"
          description="Books you're reading show up here, and you can bookmark any lesson in Explore to save it for later."
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xxl, paddingBottom: insets.bottom + spacing.massive }} showsVerticalScrollIndicator={false}>
          {library.length > 0 && (
            <Section title="Continue reading">
              <View style={{ gap: spacing.sm }}>
                {library.map(item => (
                  <BookRow key={item.id} item={item} />
                ))}
              </View>
            </Section>
          )}

          <Section title="Bookmarked lessons">
            {bookmarked === null ? null : bookmarked.length === 0 ? (
              <ThemedText variant="body" color="muted">
                Bookmark a lesson in Explore to save it here.
              </ThemedText>
            ) : (
              <View style={{ gap: spacing.sm }}>
                {bookmarked.map(a => (
                  <BookmarkedLessonRow key={a.id} article={a} />
                ))}
              </View>
            )}
          </Section>
        </ScrollView>
      )}
    </View>
  );
}
