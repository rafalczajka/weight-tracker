import React from 'react';
import { Screen, ScreenState } from '../../components';
import type { ThemeColors } from '../../theme';

interface WeightScreenProps {
  colors: ThemeColors;
  disabled: boolean;
  onAddWeight: () => void;
}

export function WeightScreen({
  colors,
  disabled,
  onAddWeight,
}: WeightScreenProps) {
  return (
    <Screen centered>
      <ScreenState
        actionDisabled={disabled}
        actionLabel="Add weight"
        colors={colors}
        kind="unavailable"
        onAction={onAddWeight}
        title="Weight history is not available yet."
      />
    </Screen>
  );
}
