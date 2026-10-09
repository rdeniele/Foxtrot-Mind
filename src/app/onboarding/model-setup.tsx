import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

import { useModel } from '@/ai/ModelProvider';
import { useOnline } from '@/ai/useOnline';
import { OnboardingScaffold } from '@/components/onboarding/OnboardingScaffold';
import { Button, ProgressBar, StatusPill, ThemedText } from '@/components/ui';
import { useAppState } from '@/state/AppStateProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

function formatMb(bytes: number) {
  return `${Math.round(bytes / 1048576)} MB`;
}

export default function ModelSetupScreen() {
  const { colors, spacing, radius } = useAppTheme();
  const { completeOnboarding } = useAppState();
  const { spec, status, progress, error, startDownload, cancelDownload } = useModel();
  const online = useOnline();

  const finish = () => {
    completeOnboarding();
    router.replace('/');
  };

  const handleImport = () => {
    if (!online) {
      Alert.alert('No internet', 'Connect to the internet once to download the model. After that, everything runs offline.');
      return;
    }
    startDownload();
  };

  return (
    <OnboardingScaffold
      step={4}
      totalSteps={4}
      title="Set up your offline AI"
      subtitle="Local AI requires a compatible model stored on this device. Everything runs without an internet connection once it's downloaded."
      footer={
        status === 'downloaded' ? (
          <Button label="Start using Foxtrot Mind" size="lg" fullWidth onPress={finish} />
        ) : (
          <View style={{ gap: spacing.md }}>
            {status === 'downloading' ? (
              <Button label="Cancel download" variant="secondary" size="lg" fullWidth onPress={cancelDownload} />
            ) : (
              <Button label={status === 'corrupted' ? 'Try again' : 'Download model'} size="lg" fullWidth onPress={handleImport} />
            )}
            <Button label="Continue without AI for now" variant="ghost" fullWidth onPress={finish} />
          </View>
        )
      }>
      <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ThemedText variant="bodyMedium">{spec.name}</ThemedText>
          {status === 'not_downloaded' && <StatusPill label="Not downloaded" tone="neutral" icon="cloud-offline-outline" />}
          {status === 'downloading' && <StatusPill label="Downloading" tone="warning" />}
          {status === 'downloaded' && <StatusPill label="Ready" tone="success" icon="checkmark-circle-outline" />}
          {status === 'corrupted' && <StatusPill label="Download failed" tone="error" />}
        </View>

        {status === 'downloading' ? (
          <View style={{ gap: spacing.sm }}>
            <ProgressBar value={progress} trailingLabel={`${Math.round(progress * 100)}%`} />
            <ThemedText variant="caption" color="muted">
              Downloading to device storage. You can leave this screen; it continues in the background.
            </ThemedText>
          </View>
        ) : status === 'downloaded' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Ionicons name="hardware-chip-outline" size={20} color={colors.accent} />
            <ThemedText variant="body" color="secondary" style={{ flex: 1 }}>
              {spec.name} is downloaded and ready. Talk, challenges, and reading feedback will run entirely on this device.
            </ThemedText>
          </View>
        ) : (
          <>
            <ThemedText variant="body" color="secondary">
              Download size: ~{formatMb(spec.sizeBytes)} ({spec.quant}). You can download it now or skip this and add it later from Settings.
            </ThemedText>
            {error && (
              <ThemedText variant="caption" color="error">
                {error}
              </ThemedText>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
              <ThemedText variant="caption" color="muted">
                Without the model, Talk and AI-assisted features stay unavailable until it&apos;s downloaded.
              </ThemedText>
            </View>
          </>
        )}
      </View>
    </OnboardingScaffold>
  );
}
