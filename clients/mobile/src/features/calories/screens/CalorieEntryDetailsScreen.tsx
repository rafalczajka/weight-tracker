import {
  deleteCalorieEntry,
  withBearerToken,
  type CalorieEntryDetailsResponse,
} from '@weight-tracker/api-client';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { apiClient } from '../../../api-client';
import { runAuthorized, type AuthSessionController } from '../../../auth';
import {
  ListRow,
  Screen,
  ScreenState,
  StatusNotice,
  TextButton,
  type StatusNoticeValue,
} from '../../../components';
import { formatDisplayDate } from '../../../date';
import { formatCaloriesKcal } from '../../../format';
import { useMutationTracker } from '../../../mutations';
import type { ThemeColors } from '../../../theme';
import { useDailyCalories } from '../hooks/useDailyCalories';

interface CalorieEntryDetailsScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  date: string;
  id: string;
  initialNotice?: string;
  onDeleted: () => void;
  onEdit: (entry: CalorieEntryDetailsResponse) => void;
}

export function CalorieEntryDetailsScreen({
  auth,
  colors,
  date,
  id,
  initialNotice,
  onDeleted,
  onEdit,
}: CalorieEntryDetailsScreenProps) {
  const details = useDailyCalories(auth, date);
  const { runMutation } = useMutationTracker();
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(
    initialNotice ? { kind: 'success', text: initialNotice } : null,
  );
  const entry = details.day?.entries.find(item => item.id === id);

  function confirmDelete() {
    Alert.alert(
      'Delete calorie entry?',
      'This calorie entry will be permanently deleted.',
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
          await deleteCalorieEntry({
            ...withBearerToken(apiClient, accessToken),
            path: { id },
          });
          return true;
        }),
      );

      if (deleted) {
        onDeleted();
      }
    } catch {
      setNotice({
        kind: 'error',
        text: 'Unable to delete calorie entry. Try again.',
      });
    } finally {
      setDeleting(false);
    }
  }

  if (details.loading && !details.day) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading entry" />
      </Screen>
    );
  }

  if (details.error || !entry) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={details.retry}
          title={details.error ?? 'Calorie entry was not found.'}
        />
      </Screen>
    );
  }

  const entryDetails: CalorieEntryDetailsResponse = { ...entry, date };

  return (
    <Screen onRefresh={details.refresh} refreshing={details.refreshing}>
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
          onPress={() => onEdit(entryDetails)}
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
