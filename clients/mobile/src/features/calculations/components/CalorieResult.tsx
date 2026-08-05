import type { CalorieResult as CalorieResultValue } from '@weight-tracker/api-client';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListRow } from '@/components';
import { formatCaloriesKcal } from '@/format';
import type { ThemeColors } from '@/theme';

interface CalorieResultProps {
  colors: ThemeColors;
  result: CalorieResultValue;
}

export function CalorieResult({ colors, result }: CalorieResultProps) {
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
          subtitle="Energy used at rest"
          title="Resting calories"
          value={formatCaloriesKcal(result.restingCaloriesPerDay)}
        />
        <ListRow
          colors={colors}
          subtitle="Estimated daily maintenance"
          title="Maintenance calories"
          value={formatCaloriesKcal(result.maintenanceCaloriesPerDay)}
        />
      </View>
    </View>
  );
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
