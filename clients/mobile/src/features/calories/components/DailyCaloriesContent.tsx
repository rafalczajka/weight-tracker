import type {
  CalorieEntryResponse,
  DailyCaloriesResponse,
} from '@weight-tracker/api-client';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ListRow,
  Screen,
  ScreenState,
  StatusNotice,
  TextButton,
  type StatusNoticeValue,
} from '@/components';
import { formatDisplayDate } from '@/date';
import { formatCaloriesKcal } from '@/format';
import type { ThemeColors } from '@/theme';

interface DailyCaloriesContentProps {
  colors: ThemeColors;
  day: DailyCaloriesResponse;
  notice: StatusNoticeValue | null;
  onAddEntry: () => void;
  onOpenEntry: (entry: CalorieEntryResponse) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function DailyCaloriesContent({
  colors,
  day,
  notice,
  onAddEntry,
  onOpenEntry,
  onRefresh,
  refreshing,
}: DailyCaloriesContentProps) {
  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <Text style={[styles.date, { color: colors.muted }]}>
        {formatDisplayDate(day.date)}
      </Text>
      <Text style={[styles.total, { color: colors.text }]}>
        {formatCaloriesKcal(day.totalCaloriesKcal)}
      </Text>
      <Text style={[styles.count, { color: colors.muted }]}>
        {day.entries.length} {day.entries.length === 1 ? 'entry' : 'entries'}
      </Text>
      <StatusNotice colors={colors} notice={notice} />

      <View style={[styles.list, { borderTopColor: colors.border }]}>
        {day.entries.map(entry => (
          <ListRow
            colors={colors}
            key={entry.id}
            onPress={() => onOpenEntry(entry)}
            subtitle={entry.description ?? 'No description'}
            title={formatCaloriesKcal(entry.caloriesKcal)}
          />
        ))}
      </View>
      {day.entries.length === 0 ? (
        <View style={styles.empty}>
          <ScreenState
            actionLabel="Add entry"
            colors={colors}
            kind="empty"
            onAction={onAddEntry}
            title="No entries for this day"
          />
        </View>
      ) : (
        <TextButton
          colors={colors}
          label="Add entry"
          onPress={onAddEntry}
          style={styles.add}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  add: {
    alignSelf: 'center',
    marginTop: 16,
  },
  count: {
    fontSize: 14,
    letterSpacing: 0,
    marginTop: 6,
    textAlign: 'center',
  },
  date: {
    fontSize: 15,
    letterSpacing: 0,
    textAlign: 'center',
  },
  empty: {
    justifyContent: 'center',
    minHeight: 240,
  },
  list: {
    borderTopWidth: 1,
  },
  total: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 8,
    textAlign: 'center',
  },
});
