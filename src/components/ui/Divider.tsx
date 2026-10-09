import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

export function Divider({ inset = 0 }: { inset?: number }) {
  const { colors } = useAppTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginLeft: inset }} />;
}
