import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ProgressBar } from './ProgressBar';
import { ThemedText } from './ThemedText';

export interface BookRowItem {
  id: string;
  title: string;
  author: string;
  progress: number;
  minutesLeft: number;
  kind: 'Book' | 'Article' | 'Short read';
}

export function BookRow({ item }: { item: BookRowItem }) {
  const { colors, spacing, radius } = useAppTheme();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/reading/[id]', params: { id: item.id } })}
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
