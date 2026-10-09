import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, IconButton, StatusPill, TextField, ThemedText, TopAppBar } from '@/components/ui';
import { ConversationSummary, conversationHistory } from '@/data/sampleContent';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function TalkHistoryScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ConversationSummary[]>(conversationHistory);

  const filtered = items.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  const handleDelete = (id: string) => {
    Alert.alert('Delete conversation', 'This conversation will be removed from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setItems((prev) => prev.filter((c) => c.id !== id)) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar title="Conversation history" leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />} />

      <View style={{ padding: spacing.xl }}>
        <TextField placeholder="Search conversations" value={query} onChangeText={setQuery} returnKeyType="search" />
      </View>

      {filtered.length === 0 ? (
        <EmptyState icon="chatbubble-ellipses-outline" title="No conversations found" description="Try a different search, or start a new conversation in Talk." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.sm, paddingBottom: spacing.xxl }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push('/talk')}
              onLongPress={() => handleDelete(item.id)}
              style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <ThemedText variant="bodyMedium">{item.title}</ThemedText>
                <StatusPill label={item.mode} />
              </View>
              <ThemedText variant="body" color="secondary" numberOfLines={1}>
                {item.preview}
              </ThemedText>
              <ThemedText variant="caption" color="muted">
                {item.lastActivity}
              </ThemedText>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
