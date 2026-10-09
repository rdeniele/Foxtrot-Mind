import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

const iconMap: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap; label: string }> = {
  index: { active: 'home', inactive: 'home-outline', label: 'Home' },
  explore: { active: 'compass', inactive: 'compass-outline', label: 'Explore' },
  talk: { active: 'chatbubble-ellipses', inactive: 'chatbubble-ellipses-outline', label: 'Talk' },
  library: { active: 'library', inactive: 'library-outline', label: 'Library' },
  progress: { active: 'trending-up', inactive: 'trending-up-outline', label: 'Progress' },
};

interface TabBarRoute {
  key: string;
  name: string;
}

interface TabBarNavigationState {
  index: number;
  routes: TabBarRoute[];
}

// The real expo-router tab bar passes a navigation object whose `emit`/`navigate`
// signatures are narrowed to a specific event map we don't need to model here.
type TabBarNavigation = any;

interface SimpleBottomTabBarProps {
  state: TabBarNavigationState;
  navigation: TabBarNavigation;
}

export function BottomNav({ state, navigation }: SimpleBottomTabBarProps) {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: insets.bottom + spacing.xs,
        paddingTop: spacing.sm,
        paddingHorizontal: spacing.sm,
      }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const meta = iconMap[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline', label: route.name };

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={meta.label}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: spacing.xs, minHeight: 48 }}>
            <Ionicons name={isFocused ? meta.active : meta.inactive} size={22} color={isFocused ? colors.accent : colors.textMuted} />
            <ThemedText variant="label" color={isFocused ? 'accent' : 'muted'}>
              {meta.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
