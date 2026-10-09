import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const { height: screenHeight } = Dimensions.get('window');

export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(screenHeight));
  const [backdropOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(screenHeight);
      backdropOpacity.setValue(0);
    }
  }, [visible, translateY, backdropOpacity]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: screenHeight, duration: 200, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropOpacity }}>
        <Pressable style={{ flex: 1 }} onPress={handleClose} accessibilityLabel="Close" />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.backgroundSecondary,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          paddingBottom: insets.bottom + spacing.lg,
          maxHeight: screenHeight * 0.85,
          transform: [{ translateY }],
        }}>
        <View style={{ alignItems: 'center', paddingTop: spacing.md }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
        </View>
        {title && (
          <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
            <ThemedText variant="h3">{title}</ThemedText>
          </View>
        )}
        <View style={{ paddingTop: title ? 0 : spacing.lg }}>{children}</View>
      </Animated.View>
    </Modal>
  );
}
