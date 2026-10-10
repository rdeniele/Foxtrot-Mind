import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, IconButton, StatusPill, ThemedText, TopAppBar } from '@/components/ui';
import { articlesByCategory, libraryCategories } from '@/data/knowledgeLibrary';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();

  const category = libraryCategories.find(c => c.id === id);
  const articles = id ? articlesByCategory(id) : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar
        title={category?.title ?? 'Category'}
        subtitle={category?.description}
        leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />}
      />
      {articles.length === 0 ? (
        <EmptyState icon="book-outline" title="More on the way" description="This category is still growing — check back soon for new lessons." />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.sm, paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
          {articles.map(article => (
            <Pressable
              key={article.id}
              onPress={() => router.push({ pathname: '/learn/[id]', params: { id: article.id } })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg }}>
              <View style={{ flex: 1, gap: 4 }}>
                {article.subcategory && (
                  <ThemedText variant="caption" color="muted">
                    {article.subcategory}
                  </ThemedText>
                )}
                <ThemedText variant="bodyMedium" numberOfLines={2}>
                  {article.title}
                </ThemedText>
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: 2 }}>
                  <StatusPill label={article.difficulty} />
                  <StatusPill label={`${article.estimatedMinutes} min`} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
