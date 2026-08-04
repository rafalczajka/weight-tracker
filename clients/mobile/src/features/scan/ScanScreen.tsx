import React from 'react';
import { Screen, ScreenState } from '../../components';
import type { ThemeColors } from '../../theme';

interface ScanScreenProps {
  colors: ThemeColors;
}

export function ScanScreen({ colors }: ScanScreenProps) {
  return (
    <Screen centered>
      <ScreenState
        colors={colors}
        kind="unavailable"
        title="Scanner is not available yet."
      />
    </Screen>
  );
}
