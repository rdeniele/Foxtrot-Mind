import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';

import { TextField, ThemedText, TopAppBar } from '@/components/ui';
import { challenges } from '@/data/sampleContent';
import { articlesByCategory, knowledgeArticles, libraryCategories } from '@/data/knowledgeLibrary';
import { useBouncyPress } from '@/hooks/use-bouncy-press';
import { useAppTheme } from '@/theme/ThemeProvider';

function ExploreRow({
  icon,
  title,
  description,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}) {
  const { colors, spacing, radius } = useAppTheme();
  const { scale, onPressIn, onPressOut } = useBouncyPress();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.lg,
          padding: spacing.lg,
        }}>
        <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={18} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText variant="bodyMedium">{title}</ThemedText>
          <ThemedText variant="caption" color="muted">
            {description}
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

function CategoryCard({
  icon,
  title,
  count,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  count: number;
  onPress: () => void;
}) {
  const { colors, spacing, radius } = useAppTheme();
  const { scale, onPressIn, onPressOut } = useBouncyPress();

  return (
    <Animated.View style={{ flexBasis: '48%', flexGrow: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.lg,
          padding: spacing.lg,
          gap: spacing.md,
          minHeight: 108,
          justifyContent: 'space-between',
        }}>
        <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={17} color={colors.accent} />
        </View>
        <View>
          <ThemedText variant="bodyMedium">{title}</ThemedText>
          <ThemedText variant="caption" color="muted">
            {count} {count === 1 ? 'lesson' : 'lessons'}
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ExploreScreen() {
  const { colors, spacing } = useAppTheme();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filteredCategories = libraryCategories.filter(c => c.title.toLowerCase().includes(q));
  const matchingArticles = q.length > 0 ? knowledgeArticles.filter(a => a.title.toLowerCase().includes(q) || a.tags.some(t => t.includes(q))) : [];
  const showChallenges = q.length === 0 || 'challenges'.includes(q) || 'puzzles'.includes(q);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopAppBar title="Explore" subtitle="Reading, puzzles, and real-world knowledge" />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <TextField placeholder="Search topics or lessons" value={query} onChangeText={setQuery} returnKeyType="search" />

        {q.length > 0 && matchingArticles.length > 0 && (
          <View style={{ gap: spacing.sm }}>
            <ThemedText variant="label" color="muted">
              LESSONS
            </ThemedText>
            {matchingArticles.map(a => (
              <Pressable key={a.id} onPress={() => router.push({ pathname: '/learn/[id]', params: { id: a.id } })} style={{ paddingVertical: spacing.sm }}>
                <ThemedText variant="bodyMedium">{a.title}</ThemedText>
                <ThemedText variant="caption" color="muted">
                  {a.subcategory ?? a.category}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}

        {showChallenges && (
          <ExploreRow
            icon="bulb-outline"
            title="Quick Challenges"
            description={`${challenges.length} logic and reasoning puzzles`}
            onPress={() => router.push('/challenge')}
          />
        )}

        {filteredCategories.length > 0 && (
          <View style={{ gap: spacing.md }}>
            <ThemedText variant="label" color="muted">
              KNOWLEDGE LIBRARY
            </ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
              {filteredCategories.map(category => (
                <CategoryCard
                  key={category.id}
                  icon={category.icon as keyof typeof Ionicons.glyphMap}
                  title={category.title}
                  count={articlesByCategory(category.id).length}
                  onPress={() => router.push({ pathname: '/learn/category/[id]', params: { id: category.id } })}
                />
              ))}
            </View>
          </View>
        )}

        <ThemedText variant="caption" color="muted" style={{ textAlign: 'center' }}>
          New categories and lessons are added regularly.
        </ThemedText>
      </ScrollView>
    </View>
  );
}
