import {
  updateCalorieEntry,
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
import { useMutationTracker } from '../../../mutations';
import type { ThemeColors } from '../../../theme';
import { CalorieForm } from '../components/CalorieForm';
import { useCalorieForm } from '../hooks/useCalorieForm';

interface EditCalorieScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  entry: CalorieEntryDetailsResponse;
  onSaved: (entry: CalorieEntryDetailsResponse) => void;
}

export function EditCalorieScreen({
  auth,
  colors,
  entry,
  onSaved,
}: EditCalorieScreenProps) {
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
    } catch {
      setNotice({
        kind: 'error',
        text: 'Unable to update calories. Try again.',
      });
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
            buttonLabel="Save changes"
            calories={form.calories}
            caloriesError={form.caloriesError}
            colors={colors}
            date={entry.date}
            dateEditable={false}
            description={form.description}
            descriptionError={form.descriptionError}
            disabled={submitting || auth.busy}
            notice={notice}
            onCaloriesBlur={form.validateCalories}
            onCaloriesChange={form.changeCalories}
            onDateChange={() => undefined}
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
