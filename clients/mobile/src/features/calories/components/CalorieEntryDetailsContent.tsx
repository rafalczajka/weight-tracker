import type { CalorieEntryResponse } from '@weight-tracker/api-client';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ListRow,
  Screen,
  StatusNotice,
  TextButton,
  type StatusNoticeValue,
} from '@/components';
import { formatDisplayDate } from '@/date';
import { formatCaloriesKcal } from '@/format';
import type { ThemeColors } from '@/theme';

interface CalorieEntryDetailsContentProps {
  colors: ThemeColors;
  date: string;
  deleting: boolean;
  entry: CalorieEntryResponse;
  notice: StatusNoticeValue | null;
  onDelete: () => void;
  onEdit: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function CalorieEntryDetailsContent({
  colors,
  date,
  deleting,
  entry,
  notice,
  onDelete,
  onEdit,
  onRefresh,
  refreshing,
}: CalorieEntryDetailsContentProps) {
  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <Text style={[styles.value, { color: colors.text }]}>
        {formatCaloriesKcal(entry.caloriesKcal)}
      </Text>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow colors={colors} title="Date" value={formatDisplayDate(date)} />
        <ListRow
          colors={colors}
          title="Description"
          value={entry.description ?? 'Not set'}
        />
      </View>
      <View style={styles.actions}>
        <TextButton
          colors={colors}
          disabled={deleting}
          label="Edit"
          onPress={onEdit}
        />
        <TextButton
          colors={colors}
          destructive
          disabled={deleting}
          label="Delete"
          loading={deleting}
          onPress={onDelete}
        />
      </View>
      <StatusNotice colors={colors} notice={notice} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  section: {
    borderTopWidth: 1,
    marginTop: 28,
  },
  value: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
});
