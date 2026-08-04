import {
  updateWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
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
import { WeightForm } from '../components/WeightForm';
import { useWeightForm } from '../hooks/useWeightForm';

interface EditWeightScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  entry: WeightsEntryResponse;
  onSaved: (entry: WeightsEntryResponse) => void;
}

export function EditWeightScreen({
  auth,
  colors,
  entry,
  onSaved,
}: EditWeightScreenProps) {
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
    } catch {
      setNotice({ kind: 'error', text: 'Unable to update weight. Try again.' });
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
          <WeightForm
            buttonLabel="Save changes"
            colors={colors}
            date={entry.date}
            dateEditable={false}
            disabled={submitting || auth.busy}
            notice={notice}
            onDateChange={() => undefined}
            onSubmit={submit}
            onWeightBlur={form.validateWeight}
            onWeightChange={form.changeWeight}
            submitting={submitting}
            weight={form.weight}
            weightError={form.weightError}
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
