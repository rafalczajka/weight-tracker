import type { CalorieEntryDetailsResponse } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { FormScreen } from '@/components';
import type { ThemeColors } from '@/theme';
import { CalorieForm } from '../components/CalorieForm';
import { useAddCalorie } from '../hooks/useAddCalorie';

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
  const model = useAddCalorie({
    auth,
    initialDate,
    initialDescription,
    onCreated,
  });

  return (
    <FormScreen>
      <CalorieForm
        buttonLabel="Add calories"
        calories={model.form.calories}
        caloriesError={model.form.caloriesError}
        colors={colors}
        date={model.date}
        dateEditable
        description={model.form.description}
        descriptionError={model.form.descriptionError}
        disabled={model.submitting || model.authBusy}
        notice={model.notice}
        onCaloriesBlur={model.form.validateCalories}
        onCaloriesChange={model.form.changeCalories}
        onDateChange={model.setDate}
        onDescriptionBlur={model.form.validateDescription}
        onDescriptionChange={model.form.changeDescription}
        onSubmit={model.submit}
        submitting={model.submitting}
      />
    </FormScreen>
  );
}
