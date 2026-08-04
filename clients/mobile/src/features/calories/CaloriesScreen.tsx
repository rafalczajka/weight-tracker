import React from 'react';
import { Screen, ScreenState } from '../../components';
import type { ThemeColors } from '../../theme';

interface CaloriesScreenProps {
  colors: ThemeColors;
}

export function CaloriesScreen({ colors }: CaloriesScreenProps) {
  return (
    <Screen centered>
      <ScreenState
        colors={colors}
        kind="unavailable"
        title="Calorie history is not available yet."
      />
    </Screen>
  );
}
