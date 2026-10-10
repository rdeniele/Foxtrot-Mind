import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CATEGORY_LABEL,
  clearAllMemories,
  deleteMemory,
  listMemories,
  MemoryCategory,
  MemoryItem,
  updateMemory,
} from '@/ai/memoryStore';
import {
  BottomSheet,
  Button,
  Chip,
  ConfirmDialog,
  EmptyState,
  IconButton,
  LoadingState,
  StatusPill,
  TextField,
  ThemedText,
  TopAppBar,
} from '@/components/ui';
import { useAppTheme } from '@/theme/ThemeProvider';

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const CATEGORY_OPTIONS: MemoryCategory[] = ['interest', 'preference', 'project', 'goal', 'fact', 'other'];

export default function MemoryScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [memories, setMemories] = useState<MemoryItem[] | null>(null);
  const [editing, setEditing] = useState<MemoryItem | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState<MemoryCategory>('other');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const refresh = useCallback(() => {
    listMemories().then(setMemories);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openEdit = (item: MemoryItem) => {
    setEditing(item);
    setEditText(item.content);
    setEditCategory(item.category);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await updateMemory(editing.id, { content: editText.trim(), category: editCategory });
    setEditing(null);
    refresh();
  };

  const removeEditing = async () => {
    if (!editing) return;
    await deleteMemory(editing.id);
    setEditing(null);
    refresh();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar
        title="Memory"
        subtitle="What your fox remembers about you"
        leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />}
      />

      {memories === null ? (
        <LoadingState label="Loading memories…" />
      ) : memories.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          title="Nothing saved yet"
          description="When you tell your fox something worth remembering in Talk, or save a message as a memory, it shows up here."
        />
      ) : (
        <FlatList
          data={memories}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.sm, paddingBottom: spacing.massive }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openEdit(item)}
              style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <StatusPill label={CATEGORY_LABEL[item.category]} />
                <ThemedText variant="caption" color="muted">
                  {formatRelativeTime(item.lastUsedAt)}
                </ThemedText>
              </View>
              <ThemedText variant="body">{item.content}</ThemedText>
            </Pressable>
          )}
          ListFooterComponent={
            <Button label="Clear all memories" variant="danger" fullWidth onPress={() => setConfirmClearAll(true)} />
          }
          ListFooterComponentStyle={{ marginTop: spacing.md }}
        />
      )}

      <BottomSheet visible={!!editing} onClose={() => setEditing(null)} title="Edit memory">
        <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg }}>
          <TextField value={editText} onChangeText={setEditText} multiline numberOfLines={2} style={{ minHeight: 60, textAlignVertical: 'top' }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {CATEGORY_OPTIONS.map(cat => (
              <Chip key={cat} label={CATEGORY_LABEL[cat]} selected={editCategory === cat} onPress={() => setEditCategory(cat)} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Button label="Save" onPress={saveEdit} />
            <Button label="Delete" variant="danger" onPress={removeEditing} />
          </View>
        </View>
      </BottomSheet>

      <ConfirmDialog
        visible={confirmClearAll}
        title="Clear all memories?"
        description="Everything your fox remembers about you will be permanently deleted from this device."
        confirmLabel="Clear everything"
        destructive
        onCancel={() => setConfirmClearAll(false)}
        onConfirm={async () => {
          setConfirmClearAll(false);
          await clearAllMemories();
          refresh();
        }}
      />
    </View>
  );
}
