import {
  createCalorieEntry,
  withBearerToken,
  type CalorieEntryDetailsResponse,
} from '@weight-tracker/api-client';
import { formatApiDate } from '@weight-tracker/client-core';
import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { FormScreen, type StatusNoticeValue } from '@/components';
import { useMutationTracker } from '@/mutations';
import type { ThemeColors } from '@/theme';
import { CalorieForm } from '../components/CalorieForm';
import { useCalorieForm } from '../hooks/useCalorieForm';

interface AddCalorieScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  initialDate?: string;
  initialDescription?: string;
  onCreated: (entry: CalorieEntryDetailsResponse) => void;
}

export function AddCalorieScreen({
  auth,
  colors,
  initialDate,
  initialDescription,
  onCreated,
}: AddCalorieScreenProps) {
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

  return (
    <FormScreen>
      <CalorieForm
        buttonLabel="Add calories"
        calories={form.calories}
        caloriesError={form.caloriesError}
        colors={colors}
        date={date}
        dateEditable
        description={form.description}
        descriptionError={form.descriptionError}
        disabled={submitting || auth.busy}
        notice={notice}
        onCaloriesBlur={form.validateCalories}
        onCaloriesChange={form.changeCalories}
        onDateChange={setDate}
        onDescriptionBlur={form.validateDescription}
        onDescriptionChange={form.changeDescription}
        onSubmit={submit}
        submitting={submitting}
      />
    </FormScreen>
  );
}
