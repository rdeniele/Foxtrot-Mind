import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { TextField, ThemedText, TopAppBar } from '@/components/ui';
import { exploreCategories } from '@/data/sampleContent';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ExploreScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const [query, setQuery] = useState('');

  const filtered = exploreCategories.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopAppBar title="Explore" subtitle="Learn something unexpected, offline" />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <TextField placeholder="Search topics" value={query} onChangeText={setQuery} returnKeyType="search" />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {filtered.map((category) => (
            <Pressable
              key={category.id}
              style={{
                flexBasis: '48%',
                flexGrow: 1,
                backgroundColor: colors.surfaceElevated,
                borderRadius: radius.lg,
                padding: spacing.lg,
                gap: spacing.md,
                minHeight: 108,
                justifyContent: 'space-between',
              }}>
              <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={17} color={colors.accent} />
              </View>
              <View>
                <ThemedText variant="bodyMedium">{category.title}</ThemedText>
                <ThemedText variant="caption" color="muted">
                  {category.count} activities
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
