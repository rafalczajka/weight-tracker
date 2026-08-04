import {
  createCalorieEntry,
  withBearerToken,
  type CalorieEntryDetailsResponse,
} from '@weight-tracker/api-client';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { apiClient } from '../../../api-client';
import { runAuthorized, type AuthSessionController } from '../../../auth';
import type { StatusNoticeValue } from '../../../components';
import { getTodayApiDate } from '../../../date';
import { useMutationTracker } from '../../../mutations';
import type { ThemeColors } from '../../../theme';
import { CalorieForm } from '../components/CalorieForm';
import { useCalorieForm } from '../hooks/useCalorieForm';

interface AddCalorieScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  initialDate?: string;
  onCreated: (entry: CalorieEntryDetailsResponse) => void;
}

export function AddCalorieScreen({
  auth,
  colors,
  initialDate,
  onCreated,
}: AddCalorieScreenProps) {
  const form = useCalorieForm();
  const { runMutation } = useMutationTracker();
  const [date, setDate] = useState(initialDate ?? getTodayApiDate());
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.fill}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    maxWidth: 420,
    paddingHorizontal: 24,
    width: '100%',
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32,
    paddingTop: 24,
  },
});
