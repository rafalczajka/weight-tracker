import {
  ApiError,
  createWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
} from '@weight-tracker/api-client';
import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { FormScreen, TextButton, type StatusNoticeValue } from '@/components';
import { getTodayApiDate } from '@/date';
import { useMutationTracker } from '@/mutations';
import type { ThemeColors } from '@/theme';
import { WeightForm } from '../components/WeightForm';
import { useWeightForm } from '../hooks/useWeightForm';

interface AddWeightScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  initialDate?: string;
  onCreated: (entry: WeightsEntryResponse) => void;
  onViewExisting: (date: string) => void;
}

export function AddWeightScreen({
  auth,
  colors,
  initialDate,
  onCreated,
  onViewExisting,
}: AddWeightScreenProps) {
  const form = useWeightForm();
  const { runMutation } = useMutationTracker();
  const [date, setDate] = useState(initialDate ?? getTodayApiDate());
  const [submitting, setSubmitting] = useState(false);
  const [conflict, setConflict] = useState(false);
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
        setNotice({ kind: 'error', text: 'Unable to add weight. Try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormScreen>
      <WeightForm
        buttonLabel="Add weight"
        colors={colors}
        date={date}
        dateEditable
        disabled={submitting || auth.busy}
        notice={notice}
        onDateChange={value => {
          setDate(value);
          setConflict(false);
          setNotice(null);
        }}
        onSubmit={submit}
        onWeightBlur={form.validateWeight}
        onWeightChange={form.changeWeight}
        submitting={submitting}
        weight={form.weight}
        weightError={form.weightError}
      />
      {conflict ? (
        <TextButton
          colors={colors}
          label="View existing entry"
          onPress={() => onViewExisting(date)}
        />
      ) : null}
    </FormScreen>
  );
}
