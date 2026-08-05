import type { DailyCaloriesResponse } from '@weight-tracker/api-client';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDisplayDate } from '@/date';
import { formatCaloriesKcal } from '@/format';
import { useCompactLayout } from '@/hooks/useCompactLayout';
import type { ThemeColors } from '@/theme';

interface CalorieHistoryTableProps {
  colors: ThemeColors;
  days: readonly DailyCaloriesResponse[];
  onOpenDay: (date: string) => void;
}

export function CalorieHistoryTable({
  colors,
  days,
  onOpenDay,
}: CalorieHistoryTableProps) {
  const compact = useCompactLayout();

  return (
    <View style={[styles.table, { borderColor: colors.border }]}>
      {!compact ? <TableHeader colors={colors} /> : null}
      {days.map(day => (
        <CalorieDayRow
          colors={colors}
          compact={compact}
          day={day}
          key={day.date}
          onPress={() => onOpenDay(day.date)}
        />
      ))}
    </View>
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
      <HeaderText colors={colors} date label="Date" />
      <HeaderText colors={colors} label="Total" />
      <HeaderText colors={colors} label="Entries" />
    </View>
  );
}

function HeaderText({
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

function CalorieDayRow({
  colors,
  compact,
  day,
  onPress,
}: {
  colors: ThemeColors;
  compact: boolean;
  day: DailyCaloriesResponse;
  onPress: () => void;
}) {
  const date = formatDisplayDate(day.date);
  const total = formatCaloriesKcal(day.totalCaloriesKcal);
  const entries = day.entries.length.toString();

  return (
    <Pressable
      accessibilityLabel={`${date}, total ${total}, ${entries} entries`}
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
          <CompactValue colors={colors} label="Total" value={total} />
          <CompactValue colors={colors} label="Entries" value={entries} />
        </View>
      ) : (
        <>
          <Text style={[styles.valueCell, { color: colors.text }]}>
            {total}
          </Text>
          <Text style={[styles.valueCell, { color: colors.text }]}>
            {entries}
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
}: {
  colors: ThemeColors;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.compactValue}>
      <Text style={[styles.compactLabel, { color: colors.muted }]}>
        {label}
      </Text>
      <Text style={[styles.compactText, { color: colors.text }]}>{value}</Text>
    </View>
  );
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
