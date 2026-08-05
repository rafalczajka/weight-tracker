import {
  deleteWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
} from '@weight-tracker/api-client';
import { useState } from 'react';
import { Alert } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { formatDisplayDate } from '@/date';
import { useInitialNotice } from '@/hooks/useInitialNotice';
import { useMutationTracker } from '@/mutations';
import { getRequestErrorMessage } from '@/network';
import { useWeightEntry } from './useWeightEntry';

interface UseWeightDetailsOptions {
  auth: AuthSessionController;
  date: string;
  initialNotice?: string;
  onDeleted: () => void;
  previousWeightKg?: number;
}

export function useWeightDetails({
  auth,
  date,
  initialNotice,
  onDeleted,
  previousWeightKg,
}: UseWeightDetailsOptions) {
  const details = useWeightEntry(auth, date);
  const { runMutation } = useMutationTracker();
  const { notice, setNotice } = useInitialNotice(initialNotice);
  const [deleting, setDeleting] = useState(false);
  const entry = details.entry;
  const changeKg = getWeightChange(entry, previousWeightKg);

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
    } catch (requestError) {
      setNotice({
        kind: 'error',
        text: getRequestErrorMessage(
          requestError,
          'Unable to delete weight. Try again.',
        ),
      });
    } finally {
      setDeleting(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Delete weight entry?',
      `The measurement for ${formatDisplayDate(
        date,
      )} will be permanently deleted.`,
      [
        { style: 'cancel', text: 'Cancel' },
        { style: 'destructive', text: 'Delete', onPress: deleteEntry },
      ],
    );
  }

  return {
    ...details,
    changeKg,
    confirmDelete,
    deleting,
    notice,
  };
}

function getWeightChange(
  entry: WeightsEntryResponse | null,
  previousWeightKg?: number,
): number | undefined {
  return entry && previousWeightKg !== undefined
    ? entry.weightKg - previousWeightKg
    : undefined;
}
