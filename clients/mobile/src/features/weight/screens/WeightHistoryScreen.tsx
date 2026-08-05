import type { WeightsEntryResponse } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';
import { WeightHistoryContent } from '../components/WeightHistoryContent';
import { useWeightHistory } from '../hooks/useWeightHistory';

interface WeightHistoryScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  initialNotice?: string;
  onAddWeight: () => void;
  onOpenEntry: (entry: WeightsEntryResponse, previousWeightKg?: number) => void;
}

export function WeightHistoryScreen({
  auth,
  colors,
  initialNotice,
  onAddWeight,
  onOpenEntry,
}: WeightHistoryScreenProps) {
  const history = useWeightHistory(auth);

  if (history.loading && !history.result) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading weights" />
      </Screen>
    );
  }

  if (history.error && !history.result) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={history.retry}
          title={history.error}
        />
      </Screen>
    );
  }

  return (
    <WeightHistoryContent
      colors={colors}
      history={history}
      initialNotice={initialNotice}
      onAddWeight={onAddWeight}
      onOpenEntry={onOpenEntry}
    />
  );
}
