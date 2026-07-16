import React from 'react';
import type { ThemeColors } from '../../ui/theme';
import type { Notice, WeightEntryController } from './useWeightEntry';
import { WeightForm } from './WeightForm';

interface WeightEntryScreenProps {
  colors: ThemeColors;
  controller: WeightEntryController;
  disabled: boolean;
  notice: Notice | null;
}

export function WeightEntryScreen({
  colors,
  controller,
  disabled,
  notice,
}: WeightEntryScreenProps) {
  return (
    <WeightForm
      colors={colors}
      disabled={disabled || controller.formDisabled}
      notice={notice}
      submitting={controller.submitting}
      weight={controller.weight}
      weightError={controller.weightError}
      onSubmit={controller.submitWeight}
      onWeightBlur={controller.validateWeight}
      onWeightChange={controller.changeWeight}
    />
  );
}
