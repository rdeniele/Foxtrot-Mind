import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { listCompletedIds } from '@/ai/libraryProgress';
import { Button, FoxCompanion, IconButton, ProgressBar, SheetAction, StatusPill, ThemedText } from '@/components/ui';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { libraryCategories } from '@/data/knowledgeLibrary';
import { library } from '@/data/readingContent';
import { useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}

function QuickStart({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  const { colors, spacing, radius } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surfaceElevated, borderRadius: radius.md, paddingVertical: spacing.md }}>
      <Ionicons name={icon} size={18} color={colors.accent} />
      <ThemedText variant="caption" color="secondary">
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { setCompanionMode } = useAppState();
  const [boredSheetOpen, setBoredSheetOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState<number | null>(null);

  useEffect(() => {
    listCompletedIds().then(ids => setCompletedCount(ids.length));
  }, []);

  const inProgress = library.filter(b => b.progress > 0 && b.progress < 1);
  const featured = inProgress[0];
  const otherInProgress = inProgress.slice(1, 3);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.massive, gap: spacing.xxl }}
        showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, gap: spacing.md }}>
          <FoxCompanion size={40} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="h2">{greeting()}</ThemedText>
            <ThemedText variant="body" color="secondary">
              What would feel worthwhile right now?
            </ThemedText>
          </View>
          <IconButton name="settings-outline" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
        </View>

        <View style={{ paddingHorizontal: spacing.xl }}>
          <StatusPill label="Offline · Everything saved locally" tone="neutral" icon="cloud-offline-outline" />
        </View>

        {/* One primary action — not five competing ones. */}
        <View style={{ paddingHorizontal: spacing.xl }}>
          {featured ? (
            <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md }}>
              <ThemedText variant="label" color="muted">
                CONTINUE READING
              </ThemedText>
              <ThemedText variant="h3">{featured.title}</ThemedText>
              <ProgressBar value={featured.progress} trailingLabel={`${featured.minutesLeft} min left`} />
              <Button label="Continue" onPress={() => router.push({ pathname: '/reading/[id]', params: { id: featured.id } })} />
            </View>
          ) : (
            <View style={{ backgroundColor: colors.accent, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md }}>
              <ThemedText variant="h3" color="onAccent">
                Talk to your fox
              </ThemedText>
              <ThemedText variant="body" color="onAccent" style={{ opacity: 0.8 }}>
                Pick up a conversation, think something through, or just say hi.
              </ThemedText>
              <Button label="Open Talk" variant="secondary" onPress={() => router.push('/talk')} />
            </View>
          )}
        </View>

        {/* Secondary, clearly subordinate entry points. */}
        <View style={{ paddingHorizontal: spacing.xl, flexDirection: 'row', gap: spacing.sm }}>
          <QuickStart icon="chatbubble-ellipses-outline" label="Talk" onPress={() => router.push('/talk')} />
          <QuickStart icon="bulb-outline" label="Challenge" onPress={() => router.push('/challenge')} />
          <QuickStart icon="sparkles-outline" label="I'm bored" onPress={() => setBoredSheetOpen(true)} />
        </View>

        {otherInProgress.length > 0 && (
          <View style={{ paddingHorizontal: spacing.xl, gap: spacing.md }}>
            <ThemedText variant="h3">Continue learning</ThemedText>
            <View style={{ gap: spacing.sm }}>
              {otherInProgress.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push({ pathname: '/reading/[id]', params: { id: item.id } })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceElevated, borderRadius: radius.md, padding: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="bodyMedium" numberOfLines={1}>
                      {item.title}
                    </ThemedText>
                    <ThemedText variant="caption" color="muted">
                      {item.minutesLeft} min left
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: spacing.xl, gap: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <ThemedText variant="h3">Explore</ThemedText>
            <Pressable onPress={() => router.push('/explore')}>
              <ThemedText variant="captionMedium" color="accent">
                See all
              </ThemedText>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
            {libraryCategories.map(category => (
              <Pressable
                key={category.id}
                onPress={() => router.push({ pathname: '/learn/category/[id]', params: { id: category.id } })}
                style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg }}>
                <ThemedText variant="bodyMedium">{category.title}</ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {completedCount !== null && completedCount > 0 && (
          <Pressable onPress={() => router.push('/progress')} style={{ paddingHorizontal: spacing.xl, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="trending-up-outline" size={16} color={colors.textMuted} />
            <ThemedText variant="caption" color="muted">
              {completedCount} {completedCount === 1 ? 'lesson' : 'lessons'} completed so far
            </ThemedText>
          </Pressable>
        )}
      </ScrollView>

      <BottomSheet visible={boredSheetOpen} onClose={() => setBoredSheetOpen(false)} title="What sounds good?">
        <SheetAction icon="bulb-outline" label="Challenge me" description="A quick reasoning puzzle" onPress={() => { setBoredSheetOpen(false); router.push('/challenge'); }} />
        <SheetAction icon="book-outline" label="Give me something to read" description="A short passage" onPress={() => { setBoredSheetOpen(false); router.push('/library'); }} />
        <SheetAction icon="school-outline" label="Teach me something interesting" description="A new idea to explore" onPress={() => { setBoredSheetOpen(false); router.push('/explore'); }} />
        <SheetAction icon="chatbubble-ellipses-outline" label="Let's talk" description="Open conversation" onPress={() => { setBoredSheetOpen(false); setCompanionMode('Friend'); router.push('/talk'); }} />
        <SheetAction icon="ear-outline" label="Let me vent" description="Listener mode, no advice" onPress={() => { setBoredSheetOpen(false); setCompanionMode('Listener'); router.push('/talk'); }} />
        <SheetAction icon="construct-outline" label="Help me brainstorm" description="Idea Partner mode" onPress={() => { setBoredSheetOpen(false); setCompanionMode('Idea Partner'); router.push('/talk'); }} />
        <SheetAction icon="shuffle-outline" label="Give me a random puzzle" description="Picked for you" onPress={() => { setBoredSheetOpen(false); router.push({ pathname: '/challenge/[id]', params: { id: 'ch1' } }); }} />
      </BottomSheet>
    </View>
  );
}
