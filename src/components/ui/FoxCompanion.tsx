import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAppTheme } from '@/theme/ThemeProvider';

export type CompanionState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'celebrating' | 'encouraging';

interface FoxCompanionProps {
  state?: CompanionState;
  size?: number;
}

export function FoxCompanion({ state = 'idle', size = 56 }: FoxCompanionProps) {
  const { colors } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(1));
  const [ringOpacity] = useState(() => new Animated.Value(0));
  const [ringRotation] = useState(() => new Animated.Value(0));
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loopRef.current?.stop();
    scale.setValue(1);
    ringOpacity.setValue(0);
    ringRotation.setValue(0);

    if (reducedMotion) return;

    if (state === 'idle') {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.045, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      );
      loopRef.current.start();
    } else if (state === 'listening') {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.08, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 420, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ]),
      );
      loopRef.current.start();
    } else if (state === 'thinking') {
      ringOpacity.setValue(1);
      loopRef.current = Animated.loop(Animated.timing(ringRotation, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }));
      loopRef.current.start();
    } else if (state === 'speaking') {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.03, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.99, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ]),
      );
      loopRef.current.start();
    } else if (state === 'celebrating') {
      loopRef.current = Animated.sequence([
        Animated.timing(scale, { toValue: 1.22, duration: 220, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.94, duration: 160, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.06, duration: 160, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]);
      loopRef.current.start();
    } else if (state === 'encouraging') {
      loopRef.current = Animated.sequence([
        Animated.timing(scale, { toValue: 0.95, duration: 160, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.02, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]);
      loopRef.current.start();
    }

    return () => loopRef.current?.stop();
  }, [state, reducedMotion, scale, ringOpacity, ringRotation]);

  const spin = ringRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={{ width: size + 16, height: size + 16, alignItems: 'center', justifyContent: 'center' }}>
      {state === 'thinking' && (
        <Animated.View
          style={{
            position: 'absolute',
            width: size + 14,
            height: size + 14,
            borderRadius: (size + 14) / 2,
            borderWidth: 2,
            borderColor: colors.accent,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            opacity: ringOpacity,
            transform: [{ rotate: spin }],
          }}
        />
      )}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image source={require('@/assets/images/foxtrot-logo.png')} style={{ width: size, height: size, borderRadius: size * 0.22 }} contentFit="cover" />
      </Animated.View>
    </View>
  );
}
