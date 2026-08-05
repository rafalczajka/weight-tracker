import { formatLabel } from '@weight-tracker/client-core';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { formatWeightKg } from '@/format';
import type { ThemeColors } from '@/theme';
import { CalculationContent } from '../components/CalculationContent';
import { CalculationState } from '../components/CalculationState';
import { ProteinResult } from '../components/ProteinResult';
import { useCalculationContext } from '../hooks/useCalculationContext';
import { useProteinCalculation } from '../hooks/useProteinCalculation';
import {
  getMissingRequirements,
  mergeCalculationRequirements,
} from '../requirements';

interface ProteinCalculatorScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddWeight: () => void;
  onUpdateProfile: () => void;
}

export function ProteinCalculatorScreen({
  auth,
  colors,
  onAddWeight,
  onUpdateProfile,
}: ProteinCalculatorScreenProps) {
  const context = useCalculationContext(auth);
  const calculation = useProteinCalculation(auth, context.revision);

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
    getMissingRequirements('protein', context.data),
    calculation.validationRequirements,
  );
  const values = [
    {
      label: 'Latest weight',
      value: latestWeight ? formatWeightKg(latestWeight.weightKg) : 'Not set',
    },
    {
      label: 'Protein goal',
      value: profile.proteinGoal ? formatLabel(profile.proteinGoal) : 'Not set',
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
        <ProteinResult colors={colors} result={calculation.result} />
      ) : null}
    </CalculationContent>
  );
}
