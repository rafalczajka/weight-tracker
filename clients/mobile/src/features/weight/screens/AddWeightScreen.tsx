import type { WeightsEntryResponse } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { FormScreen, TextButton } from '@/components';
import type { ThemeColors } from '@/theme';
import { WeightForm } from '../components/WeightForm';
import { useAddWeight } from '../hooks/useAddWeight';

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
  const model = useAddWeight({ auth, initialDate, onCreated });

  return (
    <FormScreen>
      <WeightForm
        buttonLabel="Add weight"
        colors={colors}
        date={model.date}
        dateEditable
        disabled={model.submitting || model.authBusy}
        notice={model.notice}
        onDateChange={model.changeDate}
        onSubmit={model.submit}
        onWeightBlur={model.form.validateWeight}
        onWeightChange={model.form.changeWeight}
        submitting={model.submitting}
        weight={model.form.weight}
        weightError={model.form.weightError}
      />
      {model.conflict ? (
        <TextButton
          colors={colors}
          label="View existing entry"
          onPress={() => onViewExisting(model.date)}
        />
      ) : null}
    </FormScreen>
  );
}
