import type { CalorieEntryDetailsResponse } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { FormScreen } from '@/components';
import type { ThemeColors } from '@/theme';
import { CalorieForm } from '../components/CalorieForm';
import { useEditCalorie } from '../hooks/useEditCalorie';

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
  const model = useEditCalorie({ auth, entry, onSaved });

  return (
    <FormScreen>
      <CalorieForm
        buttonLabel="Save changes"
        calories={model.form.calories}
        caloriesError={model.form.caloriesError}
        colors={colors}
        date={entry.date}
        dateEditable={false}
        description={model.form.description}
        descriptionError={model.form.descriptionError}
        disabled={model.submitting || model.authBusy}
        notice={model.notice}
        onCaloriesBlur={model.form.validateCalories}
        onCaloriesChange={model.form.changeCalories}
        onDateChange={() => undefined}
        onDescriptionBlur={model.form.validateDescription}
        onDescriptionChange={model.form.changeDescription}
        onSubmit={model.submit}
        submitting={model.submitting}
      />
    </FormScreen>
  );
}
