import React from 'react';
import type { AuthSessionController } from '@/auth';
import { formatWeightKg } from '@/format';
import type { ThemeColors } from '@/theme';
import { BmiResult } from '../components/BmiResult';
import {
  CalculationContent,
  type CalculationValue,
} from '../components/CalculationContent';
import { CalculationState } from '../components/CalculationState';
import { useBmiCalculation } from '../hooks/useBmiCalculation';
import { useCalculationContext } from '../hooks/useCalculationContext';
import {
  getMissingRequirements,
  mergeCalculationRequirements,
} from '../requirements';

interface BmiCalculatorScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddWeight: () => void;
  onUpdateProfile: () => void;
}

export function BmiCalculatorScreen({
  auth,
  colors,
  onAddWeight,
  onUpdateProfile,
}: BmiCalculatorScreenProps) {
  const context = useCalculationContext(auth);
  const calculation = useBmiCalculation(auth, context.revision);

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

  const missing = mergeCalculationRequirements(
    getMissingRequirements('bmi', context.data),
    calculation.validationRequirements,
  );
  const values: CalculationValue[] = [
    {
      label: 'Latest weight',
      value: context.data.latestWeight
        ? formatWeightKg(context.data.latestWeight.weightKg)
        : 'Not set',
    },
    {
      label: 'Height',
      value:
        context.data.profile.heightCm == null
          ? 'Not set'
          : `${context.data.profile.heightCm} cm`,
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
        <BmiResult colors={colors} result={calculation.result} />
      ) : null}
    </CalculationContent>
  );
}
