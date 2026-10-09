import { Image } from 'expo-image';
import React from 'react';

export function FoxMark({ size = 56, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <Image
      source={require('@/assets/images/foxtrot-logo.png')}
      style={{ width: size, height: size, borderRadius: size * 0.22, opacity }}
      contentFit="cover"
    />
  );
}
