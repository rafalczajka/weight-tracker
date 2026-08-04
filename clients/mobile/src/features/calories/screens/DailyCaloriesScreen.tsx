import type { CalorieEntryResponse } from '@weight-tracker/api-client';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AuthSessionController } from '@/auth';
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
import { useDailyCalories } from '../hooks/useDailyCalories';

interface DailyCaloriesScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  date: string;
  initialNotice?: string;
  onAddEntry: () => void;
  onOpenEntry: (entry: CalorieEntryResponse) => void;
}

export function DailyCaloriesScreen({
  auth,
  colors,
  date,
  initialNotice,
  onAddEntry,
  onOpenEntry,
}: DailyCaloriesScreenProps) {
  const details = useDailyCalories(auth, date);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(
    initialNotice ? { kind: 'success', text: initialNotice } : null,
  );

  useEffect(() => {
    setNotice(initialNotice ? { kind: 'success', text: initialNotice } : null);
  }, [initialNotice]);

  if (details.loading && !details.day) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading day" />
      </Screen>
    );
  }

  if (details.error || !details.day) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={details.retry}
          title={details.error ?? 'Unable to load this day.'}
        />
      </Screen>
    );
  }

  const day = details.day;

  return (
    <Screen onRefresh={details.refresh} refreshing={details.refreshing}>
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
    minHeight: 240,
    justifyContent: 'center',
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
