import {
  deleteWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
} from '@weight-tracker/api-client';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import {
  ListRow,
  Screen,
  ScreenState,
  StatusNotice,
  TextButton,
  type StatusNoticeValue,
} from '@/components';
import { formatDisplayDate } from '@/date';
import { formatWeightChange, formatWeightKg } from '@/format';
import { useMutationTracker } from '@/mutations';
import type { ThemeColors } from '@/theme';
import { useWeightEntry } from '../hooks/useWeightEntry';

interface WeightDetailsScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  date: string;
  initialNotice?: string;
  onDeleted: () => void;
  onEdit: (entry: WeightsEntryResponse) => void;
  previousWeightKg?: number;
}

export function WeightDetailsScreen({
  auth,
  colors,
  date,
  initialNotice,
  onDeleted,
  onEdit,
  previousWeightKg,
}: WeightDetailsScreenProps) {
  const details = useWeightEntry(auth, date);
  const { runMutation } = useMutationTracker();
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(
    initialNotice ? { kind: 'success', text: initialNotice } : null,
  );

  useEffect(() => {
    setNotice(initialNotice ? { kind: 'success', text: initialNotice } : null);
  }, [initialNotice]);

  function confirmDelete() {
    Alert.alert(
      'Delete weight entry?',
      `The measurement for ${formatDisplayDate(
        date,
      )} will be permanently deleted.`,
      [
        { style: 'cancel', text: 'Cancel' },
        {
          style: 'destructive',
          text: 'Delete',
          onPress: deleteEntry,
        },
      ],
    );
  }

  async function deleteEntry() {
    if (deleting) {
      return;
    }

    setDeleting(true);
    setNotice(null);

    try {
      const deleted = await runMutation(() =>
        runAuthorized(auth, async accessToken => {
          await deleteWeightEntry({
            ...withBearerToken(apiClient, accessToken),
            path: { date },
          });
          return true;
        }),
      );

      if (deleted) {
        onDeleted();
      }
    } catch {
      setNotice({ kind: 'error', text: 'Unable to delete weight. Try again.' });
    } finally {
      setDeleting(false);
    }
  }

  if (details.loading && !details.entry) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading entry" />
      </Screen>
    );
  }

  if (details.error || !details.entry) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={details.retry}
          title={details.error ?? 'Weight entry was not found.'}
        />
      </Screen>
    );
  }

  const changeKg =
    previousWeightKg === undefined
      ? undefined
      : details.entry.weightKg - previousWeightKg;
  const entry = details.entry;

  return (
    <Screen onRefresh={details.refresh} refreshing={details.refreshing}>
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
          onPress={() => onEdit(entry)}
        />
        <TextButton
          colors={colors}
          destructive
          disabled={deleting}
          label="Delete"
          loading={deleting}
          onPress={confirmDelete}
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
