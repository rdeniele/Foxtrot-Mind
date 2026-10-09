import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useModel } from '@/ai/ModelProvider';
import { useOnline } from '@/ai/useOnline';
import { BottomSheet, Chip, ConfirmDialog, Divider, IconButton, ProgressBar, SettingsRow, SheetAction, StatusPill, ThemedText, TopAppBar } from '@/components/ui';
import { ResponseLength, useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

function formatMb(bytes: number) {
  return `${Math.round(bytes / 1048576)} MB`;
}

const RESPONSE_LENGTH_LABEL: Record<ResponseLength, string> = {
  short: 'Short',
  balanced: 'Balanced',
  long: 'Long',
};

function SectionLabel({ children }: { children: string }) {
  const { spacing } = useAppTheme();
  return (
    <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.sm }}>
      <ThemedText variant="label" color="muted">
        {children.toUpperCase()}
      </ThemedText>
    </View>
  );
}

function SectionGroup({ children }: { children: React.ReactNode }) {
  const { colors, spacing, radius } = useAppTheme();
  return (
    <View style={{ marginHorizontal: spacing.xl, backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, overflow: 'hidden' }}>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, spacing, preference, setPreference } = useAppTheme();
  const { responseLength, setResponseLength } = useAppState();
  const { spec, status, progress, error, loaded, busy, startDownload, cancelDownload, removeModel, loadModel, unloadModel } = useModel();
  const online = useOnline();
  const insets = useSafeAreaInsets();
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmDeleteModel, setConfirmDeleteModel] = useState(false);
  const [responseLengthSheetOpen, setResponseLengthSheetOpen] = useState(false);

  const handleDownload = () => {
    if (!online) {
      Alert.alert('No internet', 'Connect to the internet once to download the model.');
      return;
    }
    startDownload();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <TopAppBar title="Settings" leading={<IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 48 }} showsVerticalScrollIndicator={false}>
        <SectionLabel>Appearance</SectionLabel>
        <View style={{ paddingHorizontal: spacing.xl, flexDirection: 'row', gap: spacing.sm }}>
          <Chip label="Light" selected={preference === 'light'} onPress={() => setPreference('light')} />
          <Chip label="Dark" selected={preference === 'dark'} onPress={() => setPreference('dark')} />
          <Chip label="System default" selected={preference === 'system'} onPress={() => setPreference('system')} />
        </View>

        <SectionLabel>AI and models</SectionLabel>
        <SectionGroup>
          <View style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.md + 2, gap: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ThemedText variant="bodyMedium">{spec.name}</ThemedText>
              {status === 'not_downloaded' && <StatusPill label="Not downloaded" tone="neutral" />}
              {status === 'downloading' && <StatusPill label="Downloading" tone="warning" />}
              {status === 'downloaded' && <StatusPill label={loaded ? 'Ready · loaded' : 'Downloaded'} tone="success" />}
              {status === 'corrupted' && <StatusPill label="Download failed" tone="error" />}
            </View>
            {status === 'downloading' && <ProgressBar value={progress} trailingLabel={`${Math.round(progress * 100)}%`} />}
            {error && (
              <ThemedText variant="caption" color="error">
                {error}
              </ThemedText>
            )}
          </View>
          <Divider inset={20} />
          {status === 'downloading' ? (
            <SettingsRow icon="close-circle-outline" label="Cancel download" destructive onPress={cancelDownload} />
          ) : status === 'downloaded' ? (
            <>
              {loaded ? (
                <SettingsRow icon="power-outline" label="Unload model" description="Frees up memory until next use" onPress={unloadModel} />
              ) : (
                <SettingsRow icon="flash-outline" label="Load model" description="Loads it into memory for faster replies" onPress={loadModel} disabled={busy} />
              )}
              <Divider inset={68} />
              <SettingsRow icon="trash-outline" label="Delete model" destructive onPress={() => setConfirmDeleteModel(true)} />
            </>
          ) : (
            <SettingsRow
              icon="cloud-download-outline"
              label={status === 'corrupted' ? 'Try download again' : 'Download model'}
              description={`~${formatMb(spec.sizeBytes)} · stored on this device`}
              onPress={handleDownload}
            />
          )}
          <Divider inset={68} />
          <SettingsRow icon="options-outline" label="Context length" value="2,048 tokens" />
          <Divider inset={68} />
          <SettingsRow icon="chatbox-ellipses-outline" label="Response length" value={RESPONSE_LENGTH_LABEL[responseLength]} onPress={() => setResponseLengthSheetOpen(true)} />
        </SectionGroup>

        <SectionLabel>Voice</SectionLabel>
        <SectionGroup>
          <SettingsRow icon="mic-outline" label="Speech input" description="Requires on-device speech recognition" value="Unavailable" disabled />
          <Divider inset={68} />
          <SettingsRow icon="volume-high-outline" label="Text-to-speech" description="Requires on-device voice assets" value="Unavailable" disabled />
        </SectionGroup>

        <SectionLabel>Privacy</SectionLabel>
        <SectionGroup>
          <SettingsRow icon="bookmark-outline" label="Memory" description="Let Foxtrot Mind remember things you share" switchValue={memoryEnabled} onSwitchChange={setMemoryEnabled} />
          <Divider inset={68} />
          <SettingsRow icon="chatbubbles-outline" label="Clear conversations" onPress={() => Alert.alert('Clear conversations', 'This cannot be undone.')} />
          <Divider inset={68} />
          <SettingsRow icon="journal-outline" label="Clear journal" onPress={() => Alert.alert('Clear journal', 'This cannot be undone.')} />
          <Divider inset={68} />
          <SettingsRow icon="download-outline" label="Export data" onPress={() => Alert.alert('Export data', 'Data would be saved to a local file.')} />
          <Divider inset={68} />
          <SettingsRow icon="trash-outline" label="Clear all application data" destructive onPress={() => setConfirmClearAll(true)} />
        </SectionGroup>

        <SectionLabel>About</SectionLabel>
        <SectionGroup>
          <SettingsRow icon="information-circle-outline" label="App version" value={Constants.expoConfig?.version ?? '1.0.0'} />
          <Divider inset={68} />
          <SettingsRow icon="cloud-offline-outline" label="Offline capability" description="Everything in Foxtrot Mind runs and saves on this device" />
        </SectionGroup>
      </ScrollView>

      <ConfirmDialog
        visible={confirmClearAll}
        title="Clear all application data?"
        description="Conversations, journal entries, memories, and progress will be permanently deleted from this device."
        confirmLabel="Clear everything"
        destructive
        onCancel={() => setConfirmClearAll(false)}
        onConfirm={() => setConfirmClearAll(false)}
      />

      <ConfirmDialog
        visible={confirmDeleteModel}
        title={`Delete ${spec.name}?`}
        description="You can download it again later. Talk and AI-assisted features will be unavailable until then."
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDeleteModel(false)}
        onConfirm={() => {
          setConfirmDeleteModel(false);
          removeModel();
        }}
      />

      <BottomSheet visible={responseLengthSheetOpen} onClose={() => setResponseLengthSheetOpen(false)} title="Response length">
        <SheetAction icon="remove-outline" label="Short" description="Quick, to-the-point replies" onPress={() => { setResponseLength('short'); setResponseLengthSheetOpen(false); }} />
        <SheetAction icon="reorder-two-outline" label="Balanced" description="The default for natural conversation" onPress={() => { setResponseLength('balanced'); setResponseLengthSheetOpen(false); }} />
        <SheetAction icon="menu-outline" label="Long" description="More detail and explanation" onPress={() => { setResponseLength('long'); setResponseLengthSheetOpen(false); }} />
      </BottomSheet>
    </View>
  );
}
