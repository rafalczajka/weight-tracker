import {
  updateCalorieEntry,
  withBearerToken,
  type CalorieEntryDetailsResponse,
} from '@weight-tracker/api-client';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import type { StatusNoticeValue } from '@/components';
import { useMutationTracker } from '@/mutations';
import { getRequestErrorMessage } from '@/network';
import { useCalorieForm } from './useCalorieForm';

interface UseEditCalorieOptions {
  auth: AuthSessionController;
  entry: CalorieEntryDetailsResponse;
  onSaved: (entry: CalorieEntryDetailsResponse) => void;
}

export function useEditCalorie({
  auth,
  entry,
  onSaved,
}: UseEditCalorieOptions) {
  const form = useCalorieForm(entry.caloriesKcal, entry.description);
  const { runMutation } = useMutationTracker();
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(null);

  async function submit() {
    if (submitting) {
      return;
    }

    const values = form.getValues();

    if (!values) {
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    setNotice(null);

    try {
      const updatedEntry = await runMutation(() =>
        runAuthorized(auth, async accessToken => {
          const response = await updateCalorieEntry({
            ...withBearerToken(apiClient, accessToken),
            body: values,
            path: { id: entry.id },
          });

          return response.data;
        }),
      );

      if (updatedEntry) {
        onSaved(updatedEntry);
      }
    } catch (requestError) {
      setNotice({
        kind: 'error',
        text: getRequestErrorMessage(
          requestError,
          'Unable to update calories. Try again.',
        ),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    authBusy: auth.busy,
    form,
    notice,
    submit,
    submitting,
  };
}
