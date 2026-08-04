import type { DailyCaloriesResponse } from '@weight-tracker/api-client';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDisplayDate } from '../../../date';
import { formatCaloriesKcal } from '../../../format';
import type { ThemeColors } from '../../../theme';

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
  return (
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
        <Text style={[styles.headerValue, { color: colors.muted }]}>Total</Text>
        <Text style={[styles.headerValue, { color: colors.muted }]}>
          Entries
        </Text>
      </View>
      {days.map(day => (
        <CalorieDayRow
          colors={colors}
          day={day}
          key={day.date}
          onPress={() => onOpenDay(day.date)}
        />
      ))}
    </View>
  );
}

function CalorieDayRow({
  colors,
  day,
  onPress,
}: {
  colors: ThemeColors;
  day: DailyCaloriesResponse;
  onPress: () => void;
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
        {formatDisplayDate(day.date)}
      </Text>
      <Text style={[styles.valueCell, { color: colors.text }]}>
        {formatCaloriesKcal(day.totalCaloriesKcal)}
      </Text>
      <Text style={[styles.valueCell, { color: colors.text }]}>
        {day.entries.length}
      </Text>
    </Pressable>
  );
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
