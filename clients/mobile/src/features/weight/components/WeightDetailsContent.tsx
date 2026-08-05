import type { WeightsEntryResponse } from '@weight-tracker/api-client';
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
import { formatWeightChange, formatWeightKg } from '@/format';
import type { ThemeColors } from '@/theme';

interface WeightDetailsContentProps {
  changeKg?: number;
  colors: ThemeColors;
  deleting: boolean;
  entry: WeightsEntryResponse;
  notice: StatusNoticeValue | null;
  onDelete: () => void;
  onEdit: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function WeightDetailsContent({
  changeKg,
  colors,
  deleting,
  entry,
  notice,
  onDelete,
  onEdit,
  onRefresh,
  refreshing,
}: WeightDetailsContentProps) {
  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <Text style={[styles.value, { color: colors.text }]}>
        {formatWeightKg(entry.weightKg)}
      </Text>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          title="Date"
          value={formatDisplayDate(entry.date)}
        />
        <ListRow
          colors={colors}
          title="Change"
          value={
            changeKg === undefined
              ? 'Not available'
              : formatWeightChange(changeKg)
          }
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
