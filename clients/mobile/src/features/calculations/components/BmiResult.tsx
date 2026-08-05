import type {
  BmiPostResponse,
  BmiRangeResponse,
} from '@weight-tracker/api-client';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListRow } from '@/components';
import { formatWeightKg } from '@/format';
import { useCompactLayout } from '@/hooks/useCompactLayout';
import type { ThemeColors } from '@/theme';

interface BmiResultProps {
  colors: ThemeColors;
  result: BmiPostResponse;
}

export function BmiResult({ colors, result }: BmiResultProps) {
  const compact = useCompactLayout();

  return (
    <View accessibilityLiveRegion="polite" style={styles.result}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        Result
      </Text>
      <View style={[styles.rows, { borderTopColor: colors.border }]}>
        <ListRow colors={colors} title="BMI" value={formatNumber(result.bmi)} />
        <ListRow colors={colors} title="Category" value={result.categoryName} />
        <ListRow
          colors={colors}
          title="Weight"
          value={formatWeightKg(result.weightKg)}
        />
        <ListRow
          colors={colors}
          title="Height"
          value={`${formatNumber(result.heightCm)} cm`}
        />
      </View>

      <Text
        accessibilityRole="header"
        style={[styles.rangesTitle, { color: colors.text }]}
      >
        BMI ranges
      </Text>
      <View style={[styles.rows, { borderTopColor: colors.border }]}>
        {result.ranges.map(range => (
          <BmiRangeRow
            colors={colors}
            compact={compact}
            current={range.category === result.category}
            key={range.category}
            range={range}
          />
        ))}
      </View>
    </View>
  );
}

function BmiRangeRow({
  colors,
  compact,
  current,
  range,
}: {
  colors: ThemeColors;
  compact: boolean;
  current: boolean;
  range: BmiRangeResponse;
}) {
  const currentColors = current
    ? { backgroundColor: colors.input, borderLeftColor: colors.accent }
    : undefined;

  return (
    <View
      accessible
      accessibilityLabel={`${range.categoryName}, BMI ${formatRange(
        range.minimumBmiInclusive,
        range.maximumBmiExclusive,
      )}, weight ${formatWeightRange(range)}`}
      accessibilityState={{ selected: current }}
      style={[
        styles.range,
        compact && styles.rangeCompact,
        { borderBottomColor: colors.border },
        currentColors,
      ]}
    >
      <View style={styles.rangeText}>
        <Text style={[styles.rangeName, { color: colors.text }]}>
          {range.categoryName}
        </Text>
        <Text style={[styles.rangeValue, { color: colors.muted }]}>
          BMI{' '}
          {formatRange(range.minimumBmiInclusive, range.maximumBmiExclusive)}
        </Text>
      </View>
      <Text
        style={[
          styles.weightRange,
          compact && styles.weightRangeCompact,
          { color: colors.text },
        ]}
      >
        {formatWeightRange(range)}
      </Text>
    </View>
  );
}

function formatWeightRange(range: BmiRangeResponse): string {
  const minimum = range.minimumWeightKgInclusive;
  const maximum = range.maximumWeightKgExclusive;

  if (minimum == null && maximum == null) {
    return '';
  }

  return `${formatRange(minimum, maximum)} kg`;
}

function formatRange(
  minimum: number | null | undefined,
  maximum: number | null | undefined,
): string {
  if (minimum == null) {
    return `< ${formatNumber(maximum ?? 0)}`;
  }

  if (maximum == null) {
    return `>= ${formatNumber(minimum)}`;
  }

  return `${formatNumber(minimum)} - <${formatNumber(maximum)}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

const styles = StyleSheet.create({
  range: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 3,
    flexDirection: 'row',
    minHeight: 62,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rangeName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  rangeCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  rangeText: {
    flex: 1,
    minWidth: 0,
  },
  rangeValue: {
    fontSize: 13,
    letterSpacing: 0,
    marginTop: 3,
  },
  rangesTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8,
    marginTop: 24,
  },
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
  weightRange: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    marginLeft: 12,
    textAlign: 'right',
  },
  weightRangeCompact: {
    marginLeft: 0,
    marginTop: 8,
    textAlign: 'left',
  },
});
