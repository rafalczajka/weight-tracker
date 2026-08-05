import {
  ApiError,
  createWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
} from '@weight-tracker/api-client';
import { formatApiDate } from '@weight-tracker/client-core';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import type { StatusNoticeValue } from '@/components';
import { useMutationTracker } from '@/mutations';
import { getRequestErrorMessage } from '@/network';
import { useWeightForm } from './useWeightForm';

interface UseAddWeightOptions {
  auth: AuthSessionController;
  initialDate?: string;
  onCreated: (entry: WeightsEntryResponse) => void;
}

export function useAddWeight({
  auth,
  initialDate,
  onCreated,
}: UseAddWeightOptions) {
  const form = useWeightForm();
  const { runMutation } = useMutationTracker();
  const [date, setDate] = useState(initialDate ?? formatApiDate(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [notice, setNotice] = useState<StatusNoticeValue | null>(null);

  function changeDate(value: string) {
    setDate(value);
    setConflict(false);
    setNotice(null);
  }

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
    setConflict(false);
    setNotice(null);

    try {
      const entry = await runMutation(() =>
        runAuthorized(auth, async accessToken => {
          const response = await createWeightEntry({
            ...withBearerToken(apiClient, accessToken),
            body: { date, weightKg },
          });

          return response.data;
        }),
      );

      if (entry) {
        onCreated(entry);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setConflict(true);
        setNotice({
          kind: 'info',
          text: 'Weight for this date has already been added.',
        });
      } else {
        setNotice({
          kind: 'error',
          text: getRequestErrorMessage(
            error,
            'Unable to add weight. Try again.',
          ),
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    authBusy: auth.busy,
    changeDate,
    conflict,
    date,
    form,
    notice,
    submit,
    submitting,
  };
}
