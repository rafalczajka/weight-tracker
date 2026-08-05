import React from 'react';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';

interface CalculationStateProps {
  colors: ThemeColors;
  error: string | null;
  loading: boolean;
  onRetry: () => void;
}

export function CalculationState({
  colors,
  error,
  loading,
  onRetry,
}: CalculationStateProps) {
  return (
    <Screen centered>
      <ScreenState
        actionLabel={loading ? undefined : 'Try again'}
        colors={colors}
        kind={loading ? 'loading' : 'error'}
        onAction={loading ? undefined : onRetry}
        title={loading ? 'Loading data' : error ?? 'Unable to load data.'}
      />
    </Screen>
  );
}
