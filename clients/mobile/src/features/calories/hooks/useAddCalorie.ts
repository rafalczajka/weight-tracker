import {
  createCalorieEntry,
  withBearerToken,
  type CalorieEntryDetailsResponse,
} from '@weight-tracker/api-client';
import { formatApiDate } from '@weight-tracker/client-core';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import type { StatusNoticeValue } from '@/components';
import { useMutationTracker } from '@/mutations';
import { useCalorieForm } from './useCalorieForm';

interface UseAddCalorieOptions {
  auth: AuthSessionController;
  initialDate?: string;
  initialDescription?: string;
  onCreated: (entry: CalorieEntryDetailsResponse) => void;
}

export function useAddCalorie({
  auth,
  initialDate,
  initialDescription,
  onCreated,
}: UseAddCalorieOptions) {
  const form = useCalorieForm(undefined, initialDescription);
  const { runMutation } = useMutationTracker();
  const [date, setDate] = useState(initialDate ?? formatApiDate(new Date()));
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
      const entry = await runMutation(() =>
        runAuthorized(auth, async accessToken => {
          const response = await createCalorieEntry({
            ...withBearerToken(apiClient, accessToken),
            body: { ...values, date },
          });

          return response.data;
        }),
      );

      if (entry) {
        onCreated(entry);
      }
    } catch {
      setNotice({ kind: 'error', text: 'Unable to add calories. Try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    authBusy: auth.busy,
    date,
    form,
    notice,
    setDate,
    submit,
    submitting,
  };
}
