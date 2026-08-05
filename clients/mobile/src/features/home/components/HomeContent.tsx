import type {
  DailyCaloriesResponse,
  WeightSummary,
} from '@weight-tracker/api-client';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListRow, Screen } from '@/components';
import { formatDisplayDate } from '@/date';
import { formatCaloriesKcal, formatWeightKg } from '@/format';
import type { ThemeColors } from '@/theme';

interface HomeContentProps {
  calories: DailyCaloriesResponse;
  colors: ThemeColors;
  date: string;
  error: string | null;
  onAddCalories: (date: string) => void;
  onAddWeight: (date: string) => void;
  onEditWeight: (date: string, weightKg: number) => void;
  onOpenBmiCalculator: () => void;
  onOpenCalorieCalculator: () => void;
  onOpenCalories: (date: string) => void;
  onOpenProteinCalculator: () => void;
  onRefresh: () => void;
  onScanProduct: () => void;
  refreshing: boolean;
  weight: WeightSummary;
}

export function HomeContent({
  calories,
  colors,
  date,
  error,
  onAddCalories,
  onAddWeight,
  onEditWeight,
  onOpenBmiCalculator,
  onOpenCalorieCalculator,
  onOpenCalories,
  onOpenProteinCalculator,
  onRefresh,
  onScanProduct,
  refreshing,
  weight,
}: HomeContentProps) {
  const todayWeightKg = weight.today.weightKg;
  const openWeight =
    weight.today.hasEntry && todayWeightKg != null
      ? () => onEditWeight(weight.today.date, todayWeightKg)
      : () => onAddWeight(weight.today.date);
  const openCalories = () =>
    calories.entries.length > 0 ? onOpenCalories(date) : onAddCalories(date);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <Text style={[styles.date, { color: colors.muted }]}>
        {formatDisplayDate(date)}
      </Text>
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.inlineError, { color: colors.error }]}
        >
          {error}
        </Text>
      ) : null}

      <SectionTitle colors={colors}>Today</SectionTitle>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          onPress={openWeight}
          subtitle={
            weight.today.hasEntry ? 'Edit measurement' : 'Add measurement'
          }
          title="Weight"
          value={
            todayWeightKg == null ? 'Not added' : formatWeightKg(todayWeightKg)
          }
        />
        <ListRow
          colors={colors}
          onPress={openCalories}
          subtitle={`${calories.entries.length} ${
            calories.entries.length === 1 ? 'entry' : 'entries'
          }`}
          title="Calories"
          value={formatCaloriesKcal(calories.totalCaloriesKcal)}
        />
      </View>

      <SectionTitle colors={colors}>Weight streak</SectionTitle>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          title="Current streak"
          value={formatDays(weight.streak.current)}
        />
        <ListRow
          colors={colors}
          title="Longest streak"
          value={formatDays(weight.streak.longest)}
        />
      </View>

      <SectionTitle colors={colors}>Quick actions</SectionTitle>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          onPress={() => onAddWeight(date)}
          title="Add weight"
        />
        <ListRow
          colors={colors}
          onPress={() => onAddCalories(date)}
          title="Add calories"
        />
        <ListRow colors={colors} onPress={onScanProduct} title="Scan product" />
      </View>

      <SectionTitle colors={colors}>Calculators</SectionTitle>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          onPress={onOpenBmiCalculator}
          subtitle="Check your BMI and adult ranges"
          title="BMI"
        />
        <ListRow
          colors={colors}
          onPress={onOpenCalorieCalculator}
          subtitle="Estimate resting and maintenance calories"
          title="Calorie requirement"
        />
        <ListRow
          colors={colors}
          onPress={onOpenProteinCalculator}
          subtitle="Estimate your daily protein range"
          title="Protein requirement"
        />
      </View>
    </Screen>
  );
}

function formatDays(value: number): string {
  return `${value} ${value === 1 ? 'day' : 'days'}`;
}

function SectionTitle({
  children,
  colors,
}: {
  children: string;
  colors: ThemeColors;
}) {
  return (
    <Text
      accessibilityRole="header"
      style={[styles.sectionTitle, { color: colors.text }]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 15,
    letterSpacing: 0,
  },
  inlineError: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  section: {
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8,
    marginTop: 28,
  },
});
