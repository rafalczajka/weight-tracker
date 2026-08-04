import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';
import { formatDisplayDate } from '../../../date';
import { formatWeightChange, formatWeightKg } from '../../../format';
import type { ThemeColors } from '../../../theme';

interface WeightHistoryTableProps {
  colors: ThemeColors;
  onOpenEntry: (entry: WeightsEntryResponse, previousWeightKg?: number) => void;
  result: WeightsGetResponse;
}

interface WeightRow {
  changeKg?: number;
  entry: WeightsEntryResponse;
  previousWeightKg?: number;
}

export function WeightHistoryTable({
  colors,
  onOpenEntry,
  result,
}: WeightHistoryTableProps) {
  const rows = useMemo(() => createRows(result.data), [result.data]);

  return (
    <>
      <View style={[styles.stats, { borderColor: colors.border }]}>
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
        <View
          style={[
            styles.headerRow,
            {
              backgroundColor: colors.input,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.headerDate, { color: colors.muted }]}>Date</Text>
          <Text style={[styles.headerValue, { color: colors.muted }]}>
            Weight
          </Text>
          <Text style={[styles.headerValue, { color: colors.muted }]}>
            Change
          </Text>
        </View>
        {rows.map(row => (
          <WeightTableRow
            colors={colors}
            key={row.entry.date}
            row={row}
            onPress={() => onOpenEntry(row.entry, row.previousWeightKg)}
          />
        ))}
      </View>
    </>
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
  onPress,
  row,
}: {
  colors: ThemeColors;
  onPress: () => void;
  row: WeightRow;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.dataRow,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Text numberOfLines={1} style={[styles.dateCell, { color: colors.text }]}>
        {formatDisplayDate(row.entry.date)}
      </Text>
      <Text style={[styles.valueCell, { color: colors.text }]}>
        {formatWeightKg(row.entry.weightKg)}
      </Text>
      <Text
        style={[
          styles.valueCell,
          {
            color:
              row.changeKg === undefined || row.changeKg === 0
                ? colors.muted
                : row.changeKg < 0
                ? colors.success
                : colors.error,
          },
        ]}
      >
        {row.changeKg === undefined ? '-' : formatWeightChange(row.changeKg)}
      </Text>
    </Pressable>
  );
}

function createRows(entries: readonly WeightsEntryResponse[]): WeightRow[] {
  return entries
    .map((entry, index) => ({
      entry,
      ...(index > 0
        ? {
            changeKg: entry.weightKg - entries[index - 1].weightKg,
            previousWeightKg: entries[index - 1].weightKg,
          }
        : {}),
    }))
    .reverse();
}

const styles = StyleSheet.create({
  dataRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: 12,
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
