import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityTile, Button, IconButton, SheetAction, StatusPill, ThemedText } from '@/components/ui';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}

export default function HomeScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { setCompanionMode } = useAppState();
  const [boredSheetOpen, setBoredSheetOpen] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  const notBuilt = (feature: string) => Alert.alert(feature, 'This part of Foxtrot Mind is coming in a future update.');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.massive }}
        showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, gap: spacing.md }}>
          <Image source={require('@/assets/images/foxtrot-logo.png')} style={{ width: 36, height: 36, borderRadius: 10 }} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="h2">{greeting()}</ThemedText>
            <ThemedText variant="body" color="secondary">
              What would feel worthwhile right now?
            </ThemedText>
          </View>
          <IconButton name="settings-outline" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
        </View>

        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.lg }}>
          <StatusPill label="Offline · Everything saved locally" tone="neutral" icon="cloud-offline-outline" />
        </View>

        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.xxl }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            <ActivityTile icon="chatbubble-ellipses-outline" title="Talk" description="Talk things through." onPress={() => router.push('/talk')} accent />
            <ActivityTile icon="book-outline" title="Read" description="Explore a story or idea." onPress={() => router.push('/library')} />
            <ActivityTile icon="bulb-outline" title="Challenge" description="Exercise your reasoning." onPress={() => router.push('/challenge')} />
            <ActivityTile icon="create-outline" title="Brain Dump" description="Get your thoughts out." onPress={() => notBuilt('Brain Dump')} />
            <ActivityTile icon="compass-outline" title="Explore" description="Learn something unexpected." onPress={() => router.push('/explore')} />
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.xxl }}>
          <Button label="I'm bored" variant="secondary" size="lg" fullWidth icon={<ThemedText>🦊</ThemedText>} onPress={() => setBoredSheetOpen(true)} />
        </View>

        {!sessionDismissed && (
          <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.xxl }}>
            <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.lg }}>
              <ThemedText variant="h3">Your next 10 minutes</ThemedText>
              <View style={{ gap: spacing.sm }}>
                {['Read for 5 minutes', 'Solve one challenge', 'Reflect on one question'].map((item) => (
                  <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent }} />
                    <ThemedText variant="body" color="secondary">
                      {item}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <Button label="Start" onPress={() => router.push('/library')} />
                <Button label="Skip" variant="ghost" onPress={() => setSessionDismissed(true)} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomSheet visible={boredSheetOpen} onClose={() => setBoredSheetOpen(false)} title="What sounds good?">
        <SheetAction icon="bulb-outline" label="Challenge me" description="A quick reasoning puzzle" onPress={() => { setBoredSheetOpen(false); router.push('/challenge'); }} />
        <SheetAction icon="book-outline" label="Give me something to read" description="A short passage" onPress={() => { setBoredSheetOpen(false); router.push('/library'); }} />
        <SheetAction icon="school-outline" label="Teach me something interesting" description="A new idea to explore" onPress={() => { setBoredSheetOpen(false); router.push('/explore'); }} />
        <SheetAction icon="chatbubble-ellipses-outline" label="Let's talk" description="Open conversation" onPress={() => { setBoredSheetOpen(false); setCompanionMode('Friend'); router.push('/talk'); }} />
        <SheetAction icon="ear-outline" label="Let me vent" description="Listener mode, no advice" onPress={() => { setBoredSheetOpen(false); setCompanionMode('Listener'); router.push('/talk'); }} />
        <SheetAction icon="construct-outline" label="Help me brainstorm" description="Idea Partner mode" onPress={() => { setBoredSheetOpen(false); setCompanionMode('Idea Partner'); router.push('/talk'); }} />
        <SheetAction icon="shuffle-outline" label="Give me a random puzzle" description="Picked for you" onPress={() => { setBoredSheetOpen(false); router.push('/challenge/ch1'); }} />
      </BottomSheet>
    </View>
  );
}
