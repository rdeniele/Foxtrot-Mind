import { Stack } from 'expo-router';

import { useAppTheme } from '@/theme/ThemeProvider';

export default function OnboardingLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
