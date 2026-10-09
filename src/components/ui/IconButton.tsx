import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type Variant = 'plain' | 'surface' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<PressableProps, 'style'> {
  name: keyof typeof Ionicons.glyphMap;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  accessibilityLabel: string;
}

const sizeMap: Record<Size, { box: number; icon: number }> = {
  sm: { box: 36, icon: 18 },
  md: { box: 44, icon: 21 },
  lg: { box: 52, icon: 24 },
};

export function IconButton({ name, variant = 'plain', size = 'md', disabled, ...rest }: IconButtonProps) {
  const { colors, radius } = useAppTheme();
  const { box, icon } = sizeMap[size];

  const bgMap: Record<Variant, string> = {
    plain: 'transparent',
    surface: colors.surfaceElevated,
    accent: colors.accent,
  };
  const iconColor = variant === 'accent' ? colors.onAccent : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => ({
        width: box,
        height: box,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? colors.border : bgMap[variant],
        opacity: disabled ? 0.4 : 1,
      })}
      {...rest}>
      <Ionicons name={name} size={icon} color={iconColor} />
    </Pressable>
  );
}
