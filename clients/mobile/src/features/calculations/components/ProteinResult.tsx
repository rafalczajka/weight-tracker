import type { ProteinResult as ProteinResultValue } from '@weight-tracker/api-client';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListRow } from '@/components';
import type { ThemeColors } from '@/theme';

interface ProteinResultProps {
  colors: ThemeColors;
  result: ProteinResultValue;
}

export function ProteinResult({ colors, result }: ProteinResultProps) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.result}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        Result
      </Text>
      <View style={[styles.rows, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          title="Minimum protein"
          value={formatGrams(result.minimumProteinGramsPerDay)}
        />
        <ListRow
          colors={colors}
          title="Maximum protein"
          value={formatGrams(result.maximumProteinGramsPerDay)}
        />
      </View>
    </View>
  );
}

function formatGrams(value: number): string {
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })} g/day`;
}

const styles = StyleSheet.create({
  result: {
    marginTop: 4,
  },
  rows: {
    borderTopWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8,
  },
});
