import type {
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDisplayDate } from '@/date';
import { formatWeightChange, formatWeightKg } from '@/format';
import { useCompactLayout } from '@/hooks/useCompactLayout';
import type { ThemeColors } from '@/theme';
import { createWeightHistoryRows, type WeightHistoryRow } from '../history';

interface WeightHistoryTableProps {
  colors: ThemeColors;
  onOpenEntry: (entry: WeightsEntryResponse, previousWeightKg?: number) => void;
  result: WeightsGetResponse;
}

export function WeightHistoryTable({
  colors,
  onOpenEntry,
  result,
}: WeightHistoryTableProps) {
  const compact = useCompactLayout();
  const rows = useMemo(
    () => createWeightHistoryRows(result.data),
    [result.data],
  );

  return (
    <>
      <View
        style={[
          styles.stats,
          compact && styles.statsCompact,
          { borderColor: colors.border },
        ]}
      >
        <Stat
          colors={colors}
          label="Minimum"
          value={formatWeightKg(result.stats.minimumWeightKg)}
        />
        <Stat
          colors={colors}
          label="Average"
          value={formatWeightKg(result.stats.averageWeightKg)}
        />
        <Stat
          colors={colors}
          label="Maximum"
          value={formatWeightKg(result.stats.maximumWeightKg)}
        />
      </View>
      <View style={[styles.table, { borderColor: colors.border }]}>
        {!compact ? <TableHeader colors={colors} /> : null}
        {rows.map(row => (
          <WeightTableRow
            colors={colors}
            compact={compact}
            key={row.entry.date}
            onPress={() => onOpenEntry(row.entry, row.previousWeightKg)}
            row={row}
          />
        ))}
      </View>
    </>
  );
}

function TableHeader({ colors }: { colors: ThemeColors }) {
  return (
    <View
      style={[
        styles.headerRow,
        {
          backgroundColor: colors.input,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TableHeaderText colors={colors} date label="Date" />
      <TableHeaderText colors={colors} label="Weight" />
      <TableHeaderText colors={colors} label="Change" />
    </View>
  );
}

function TableHeaderText({
  colors,
  date = false,
  label,
}: {
  colors: ThemeColors;
  date?: boolean;
  label: string;
}) {
  return (
    <Text
      accessibilityRole="header"
      style={[
        date ? styles.headerDate : styles.headerValue,
        { color: colors.muted },
      ]}
    >
      {label}
    </Text>
  );
}

function Stat({
  colors,
  label,
  value,
}: {
  colors: ThemeColors;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function WeightTableRow({
  colors,
  compact,
  onPress,
  row,
}: {
  colors: ThemeColors;
  compact: boolean;
  onPress: () => void;
  row: WeightHistoryRow;
}) {
  const date = formatDisplayDate(row.entry.date);
  const weight = formatWeightKg(row.entry.weightKg);
  const change =
    row.changeKg === undefined ? '-' : formatWeightChange(row.changeKg);

  return (
    <Pressable
      accessibilityLabel={`${date}, weight ${weight}, change ${change}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.dataRow,
        compact && styles.dataRowCompact,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Text
        numberOfLines={compact ? undefined : 1}
        style={[
          styles.dateCell,
          compact && styles.compactDate,
          { color: colors.text },
        ]}
      >
        {date}
      </Text>
      {compact ? (
        <View style={styles.compactValues}>
          <CompactValue colors={colors} label="Weight" value={weight} />
          <CompactValue
            colors={colors}
            label="Change"
            value={change}
            valueColor={getChangeColor(colors, row.changeKg)}
          />
        </View>
      ) : (
        <>
          <Text style={[styles.valueCell, { color: colors.text }]}>
            {weight}
          </Text>
          <Text
            style={[
              styles.valueCell,
              { color: getChangeColor(colors, row.changeKg) },
            ]}
          >
            {change}
          </Text>
        </>
      )}
    </Pressable>
  );
}

function CompactValue({
  colors,
  label,
  value,
  valueColor,
}: {
  colors: ThemeColors;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.compactValue}>
      <Text style={[styles.compactLabel, { color: colors.muted }]}>
        {label}
      </Text>
      <Text style={[styles.compactText, { color: valueColor ?? colors.text }]}>
        {value}
      </Text>
    </View>
  );
}

function getChangeColor(colors: ThemeColors, changeKg?: number) {
  if (changeKg === undefined || changeKg === 0) {
    return colors.muted;
  }

  return changeKg < 0 ? colors.success : colors.error;
}

const styles = StyleSheet.create({
  compactDate: {
    fontSize: 15,
    fontWeight: '700',
    paddingRight: 0,
  },
  compactLabel: {
    fontSize: 13,
    letterSpacing: 0,
  },
  compactText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  compactValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  compactValues: {
    marginTop: 4,
  },
  dataRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: 12,
  },
  dataRowCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
    paddingVertical: 12,
  },
  dateCell: {
    flex: 1.4,
    fontSize: 14,
    letterSpacing: 0,
    paddingRight: 6,
  },
  headerDate: {
    flex: 1.4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  headerRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  headerValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.62,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    letterSpacing: 0,
  },
  stats: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    marginBottom: 20,
    paddingVertical: 14,
  },
  statsCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 12,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 4,
  },
  table: {
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  valueCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    textAlign: 'right',
  },
});
