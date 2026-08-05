import type { WeightsEntryResponse } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { FormScreen } from '@/components';
import type { ThemeColors } from '@/theme';
import { WeightForm } from '../components/WeightForm';
import { useEditWeight } from '../hooks/useEditWeight';

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
  const model = useEditWeight({ auth, entry, onSaved });

  return (
    <FormScreen>
      <WeightForm
        buttonLabel="Save changes"
        colors={colors}
        date={entry.date}
        dateEditable={false}
        disabled={model.submitting || model.authBusy}
        notice={model.notice}
        onDateChange={() => undefined}
        onSubmit={model.submit}
        onWeightBlur={model.form.validateWeight}
        onWeightChange={model.form.changeWeight}
        submitting={model.submitting}
        weight={model.form.weight}
        weightError={model.form.weightError}
      />
    </FormScreen>
  );
}
