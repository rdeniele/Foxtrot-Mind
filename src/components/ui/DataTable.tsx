import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

import { ThemedText } from './ThemedText';

interface DataTableProps {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export function DataTable({ caption, headers, rows }: DataTableProps) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      {caption && (
        <ThemedText variant="caption" color="muted">
          {caption}
        </ThemedText>
      )}
      <View style={{ borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', backgroundColor: colors.surfaceElevated }}>
          {headers.map((h, i) => (
            <View key={i} style={{ flex: 1, paddingVertical: spacing.sm, paddingHorizontal: spacing.md }}>
              <ThemedText variant="captionMedium" color="secondary">
                {h}
              </ThemedText>
            </View>
          ))}
        </View>
        {rows.map((row, r) => (
          <View
            key={r}
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: r % 2 === 1 ? colors.surfaceElevated : 'transparent',
            }}>
            {row.map((cell, c) => (
              <View key={c} style={{ flex: 1, paddingVertical: spacing.sm, paddingHorizontal: spacing.md }}>
                <ThemedText variant="body">{cell}</ThemedText>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
