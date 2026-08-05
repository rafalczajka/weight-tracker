import { formatLabel } from '@weight-tracker/client-core';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { formatDisplayDate } from '@/date';
import { formatWeightKg } from '@/format';
import type { ThemeColors } from '@/theme';
import { CalculationContent } from '../components/CalculationContent';
import { CalculationState } from '../components/CalculationState';
import { CalorieResult } from '../components/CalorieResult';
import { useCalculationContext } from '../hooks/useCalculationContext';
import { useCalorieCalculation } from '../hooks/useCalorieCalculation';
import {
  getMissingRequirements,
  mergeCalculationRequirements,
} from '../requirements';

interface CalorieCalculatorScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddWeight: () => void;
  onUpdateProfile: () => void;
}

export function CalorieCalculatorScreen({
  auth,
  colors,
  onAddWeight,
  onUpdateProfile,
}: CalorieCalculatorScreenProps) {
  const context = useCalculationContext(auth);
  const calculation = useCalorieCalculation(auth, context.revision);

  if (!context.data) {
    return (
      <CalculationState
        colors={colors}
        error={context.error}
        loading={context.loading}
        onRetry={context.retry}
      />
    );
  }

  const { latestWeight, profile } = context.data;
  const missing = mergeCalculationRequirements(
    getMissingRequirements('calories', context.data),
    calculation.validationRequirements,
  );
  const values = [
    {
      label: 'Latest weight',
      value: latestWeight ? formatWeightKg(latestWeight.weightKg) : 'Not set',
    },
    {
      label: 'Height',
      value: profile.heightCm == null ? 'Not set' : `${profile.heightCm} cm`,
    },
    {
      label: 'Date of birth',
      value: profile.dateOfBirth
        ? formatDisplayDate(profile.dateOfBirth)
        : 'Not set',
    },
    { label: 'Sex', value: formatOptionalLabel(profile.sex) },
    {
      label: 'Activity level',
      value: formatOptionalLabel(profile.activityLevel),
    },
  ];

  return (
    <CalculationContent
      authBusy={auth.busy}
      calculating={calculation.calculating}
      colors={colors}
      loadError={context.error}
      missing={missing}
      notice={calculation.notice}
      onAddWeight={onAddWeight}
      onCalculate={calculation.calculate}
      onUpdateProfile={onUpdateProfile}
      values={values}
    >
      {calculation.result ? (
        <CalorieResult colors={colors} result={calculation.result} />
      ) : null}
    </CalculationContent>
  );
}

function formatOptionalLabel(value: string | null | undefined): string {
  return value ? formatLabel(value) : 'Not set';
}
