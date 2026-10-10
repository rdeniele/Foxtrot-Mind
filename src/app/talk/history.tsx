import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { deleteConversation, formatRelativeTime, listConversations, StoredConversation } from '@/ai/conversationStore';
import { EmptyState, IconButton, LoadingState, StatusPill, TextField, ThemedText, TopAppBar } from '@/components/ui';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function TalkHistoryScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<StoredConversation[] | null>(null);

  const refresh = useCallback(() => {
    listConversations().then(setItems);
  }, []);

  useFocusEffect(refresh);

  const filtered = (items ?? []).filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  const handleDelete = (id: string) => {
    Alert.alert('Delete conversation', 'This conversation will be removed from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteConversation(id);
          refresh();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar title="Conversation history" leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />} />

      <View style={{ padding: spacing.xl }}>
        <TextField placeholder="Search conversations" value={query} onChangeText={setQuery} returnKeyType="search" />
      </View>

      {items === null ? (
        <LoadingState label="Loading conversations…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="chatbubble-ellipses-outline"
          title={items.length === 0 ? 'No conversations yet' : 'No conversations found'}
          description={items.length === 0 ? 'Start talking in Talk, and your conversations will show up here.' : 'Try a different search.'}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.sm, paddingBottom: spacing.xxl }}
          renderItem={({ item }) => {
            const lastMessage = item.messages[item.messages.length - 1];
            return (
              <Pressable
                onPress={() => router.push({ pathname: '/talk', params: { id: item.id } })}
                onLongPress={() => handleDelete(item.id)}
                style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ThemedText variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <StatusPill label={item.mode} />
                </View>
                {lastMessage && (
                  <ThemedText variant="body" color="secondary" numberOfLines={1}>
                    {lastMessage.text}
                  </ThemedText>
                )}
                <ThemedText variant="caption" color="muted">
                  {formatRelativeTime(item.updatedAt)}
                </ThemedText>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
