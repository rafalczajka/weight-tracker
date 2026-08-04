import React from 'react';
import { Screen, ScreenState } from '../../components';
import type { ThemeColors } from '../../theme';

interface HomeScreenProps {
  colors: ThemeColors;
}

export function HomeScreen({ colors }: HomeScreenProps) {
  return (
    <Screen centered>
      <ScreenState
        colors={colors}
        kind="unavailable"
        title="Home is not available yet."
      />
    </Screen>
  );
}
