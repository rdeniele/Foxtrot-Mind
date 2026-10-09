import React from 'react';
import { Modal, Pressable, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { Button } from './Button';
import { ThemedText } from './ThemedText';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
        <Pressable style={{ ...StyleSheetAbsoluteFill }} onPress={onCancel} accessibilityLabel="Dismiss" />
        <View
          style={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: colors.backgroundSecondary,
            borderRadius: radius.lg,
            padding: spacing.xxl,
            gap: spacing.sm,
          }}>
          <ThemedText variant="h3">{title}</ThemedText>
          {description && (
            <ThemedText variant="body" color="secondary">
              {description}
            </ThemedText>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.lg }}>
            <Button label={cancelLabel} variant="ghost" onPress={onCancel} />
            <Button label={confirmLabel} variant={destructive ? 'danger' : 'primary'} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const StyleSheetAbsoluteFill = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };
