import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, UIManager, View } from 'react-native';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpandableSectionProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

/** Collapsed by default — the standard way optional/secondary content stays out of the way until asked for. */
export function ExpandableSection({ title, subtitle, icon, defaultExpanded = false, children }: ExpandableSectionProps) {
  const { colors, spacing, radius } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    if (!reducedMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(v => !v);
  };

  return (
    <View style={{ backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, overflow: 'hidden' }}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }}>
        {icon && <Ionicons name={icon} size={18} color={colors.accent} />}
        <View style={{ flex: 1 }}>
          <ThemedText variant="bodyMedium">{title}</ThemedText>
          {subtitle && (
            <ThemedText variant="caption" color="muted">
              {subtitle}
            </ThemedText>
          )}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </Pressable>
      {expanded && <View style={{ padding: spacing.lg, paddingTop: 0, gap: spacing.md }}>{children}</View>}
    </View>
  );
}
