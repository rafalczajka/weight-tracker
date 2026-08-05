import {
  updateWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
} from '@weight-tracker/api-client';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import type { StatusNoticeValue } from '@/components';
import { useMutationTracker } from '@/mutations';
import { getRequestErrorMessage } from '@/network';
import { useWeightForm } from './useWeightForm';

interface UseEditWeightOptions {
  auth: AuthSessionController;
  entry: WeightsEntryResponse;
  onSaved: (entry: WeightsEntryResponse) => void;
}

export function useEditWeight({ auth, entry, onSaved }: UseEditWeightOptions) {
  const form = useWeightForm(entry.weightKg);
  const { runMutation } = useMutationTracker();
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(null);

  async function submit() {
    if (submitting) {
      return;
    }

    const weightKg = form.getWeightKg();

    if (weightKg === null) {
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    setNotice(null);

    try {
      const updatedEntry = await runMutation(() =>
        runAuthorized(auth, async accessToken => {
          const response = await updateWeightEntry({
            ...withBearerToken(apiClient, accessToken),
            body: { weightKg },
            path: { date: entry.date },
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
          'Unable to update weight. Try again.',
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
