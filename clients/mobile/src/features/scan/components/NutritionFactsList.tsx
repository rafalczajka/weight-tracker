import type { NutritionFacts } from '@weight-tracker/api-client';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListRow } from '@/components';
import type { ThemeColors } from '@/theme';

interface NutritionFactsListProps {
  colors: ThemeColors;
  facts: NutritionFacts;
  title: string;
}

export function NutritionFactsList({
  colors,
  facts,
  title,
}: NutritionFactsListProps) {
  const rows = getRows(facts);

  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={styles.group}>
      <Text style={[styles.heading, { color: colors.muted }]}>{title}</Text>
      {rows.map(row => (
        <ListRow
          colors={colors}
          key={row.label}
          title={row.label}
          value={row.value}
        />
      ))}
    </View>
  );
}

function getRows(facts: NutritionFacts) {
  return [
    nutritionRow('Energy', facts.energyKcal, 'kcal', facts.energyKj, 'kJ'),
    nutritionRow('Fat', facts.fatG, 'g'),
    nutritionRow('Saturated fat', facts.saturatedFatG, 'g'),
    nutritionRow('Carbohydrates', facts.carbohydratesG, 'g'),
    nutritionRow('Sugars', facts.sugarsG, 'g'),
    nutritionRow('Added sugars', facts.addedSugarsG, 'g'),
    nutritionRow('Fiber', facts.fiberG, 'g'),
    nutritionRow('Protein', facts.proteinG, 'g'),
    nutritionRow('Salt', facts.saltG, 'g'),
  ].filter((row): row is { label: string; value: string } => row !== null);
}

function nutritionRow(
  label: string,
  value?: number | null,
  unit?: string,
  secondaryValue?: number | null,
  secondaryUnit?: string,
) {
  const values = [
    value === null || value === undefined
      ? null
      : `${formatNumber(value)} ${unit}`,
    secondaryValue === null || secondaryValue === undefined
      ? null
      : `${formatNumber(secondaryValue)} ${secondaryUnit}`,
  ].filter((item): item is string => item !== null);

  return values.length > 0 ? { label, value: values.join(' / ') } : null;
}

function formatNumber(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: 2,
    marginTop: 8,
    textTransform: 'uppercase',
  },
});
