import {
  deleteCalorieEntry,
  withBearerToken,
} from '@weight-tracker/api-client';
import { useState } from 'react';
import { Alert } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { useInitialNotice } from '@/hooks/useInitialNotice';
import { useMutationTracker } from '@/mutations';
import { useDailyCalories } from './useDailyCalories';

interface UseCalorieEntryDetailsOptions {
  auth: AuthSessionController;
  date: string;
  id: string;
  initialNotice?: string;
  onDeleted: () => void;
}

export function useCalorieEntryDetails({
  auth,
  date,
  id,
  initialNotice,
  onDeleted,
}: UseCalorieEntryDetailsOptions) {
  const details = useDailyCalories(auth, date);
  const { runMutation } = useMutationTracker();
  const { notice, setNotice } = useInitialNotice(initialNotice);
  const [deleting, setDeleting] = useState(false);
  const entry = details.day?.entries.find(item => item.id === id);

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

  function confirmDelete() {
    Alert.alert(
      'Delete calorie entry?',
      'This calorie entry will be permanently deleted.',
      [
        { style: 'cancel', text: 'Cancel' },
        { style: 'destructive', text: 'Delete', onPress: deleteEntry },
      ],
    );
  }

  return {
    ...details,
    confirmDelete,
    deleting,
    entry,
    notice,
  };
}
