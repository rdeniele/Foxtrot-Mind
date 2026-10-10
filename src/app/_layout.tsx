import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ModelProvider } from '@/ai/ModelProvider';
import { AppStateProvider, useAppState } from '@/state/AppStateProvider';
import { ThemeProvider, useAppTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { mode, colors } = useAppTheme();
  const { onboardingComplete } = useAppState();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Protected guard={!onboardingComplete}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={onboardingComplete}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Screen name="talk/history" options={{ presentation: 'card' }} />
        <Stack.Screen name="reading/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="reading/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="reading/summary" options={{ presentation: 'card' }} />
        <Stack.Screen name="challenge/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="challenge/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="settings/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="memory/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="learn/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="learn/category/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppStateProvider>
            <ModelProvider>
              <RootNavigator />
            </ModelProvider>
          </AppStateProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
