import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookRow, IconButton, ThemedText, TopAppBar } from '@/components/ui';
import { library, recommendedOffline } from '@/data/readingContent';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function ReadingCatalogScreen() {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar title="Reading" subtitle="Essays and short reads, offline" leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xxl, paddingBottom: spacing.massive }} showsVerticalScrollIndicator={false}>
        {library.length > 0 && (
          <View style={{ gap: spacing.md }}>
            <ThemedText variant="h3">Continue reading</ThemedText>
            <View style={{ gap: spacing.sm }}>
              {library.map(item => (
                <BookRow key={item.id} item={item} />
              ))}
            </View>
          </View>
        )}

        <View style={{ gap: spacing.md }}>
          <ThemedText variant="h3">More to read</ThemedText>
          <View style={{ gap: spacing.sm }}>
            {recommendedOffline.map(item => (
              <BookRow key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
