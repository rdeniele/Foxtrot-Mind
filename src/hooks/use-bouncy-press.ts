import { useState } from 'react';
import { Animated } from 'react-native';

import { useReducedMotion } from './use-reduced-motion';

/** A small, springy scale-down-on-press feel used across tappable cards and buttons. */
export function useBouncyPress(scaleTo = 0.95) {
  const reducedMotion = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(1));

  const onPressIn = () => {
    if (reducedMotion) return;
    Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, speed: 60, bounciness: 6 }).start();
  };

  const onPressOut = () => {
    if (reducedMotion) return;
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 10 }).start();
  };

  return { scale, onPressIn, onPressOut };
}
