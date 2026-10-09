import React from 'react';
import { View, ViewProps } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

type SurfaceLevel = 'background' | 'secondary' | 'elevated';

interface SurfaceProps extends ViewProps {
  level?: SurfaceLevel;
  bordered?: boolean;
  radius?: number;
}

export function Surface({ level = 'background', bordered = false, radius: radiusOverride, style, ...rest }: SurfaceProps) {
  const { colors } = useAppTheme();

  const backgroundMap: Record<SurfaceLevel, string> = {
    background: colors.background,
    secondary: colors.backgroundSecondary,
    elevated: colors.surfaceElevated,
  };

  return (
    <View
      style={[
        {
          backgroundColor: backgroundMap[level],
          borderRadius: radiusOverride ?? 0,
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    />
  );
}
