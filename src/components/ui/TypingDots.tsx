import React, { useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAppTheme } from '@/theme/ThemeProvider';

export function TypingDots() {
  const { colors } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const [values] = useState(() => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);

  useEffect(() => {
    if (reducedMotion) return;
    const animations = values.map((value, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(value, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration: 320, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.delay((2 - i) * 140),
        ]),
      ),
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, [values, reducedMotion]);

  return (
    <View style={{ flexDirection: 'row', gap: 4, paddingVertical: 2 }}>
      {values.map((value, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.textMuted,
            opacity: reducedMotion ? 0.6 : value.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
            transform: reducedMotion ? undefined : [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
          }}
        />
      ))}
    </View>
  );
}
