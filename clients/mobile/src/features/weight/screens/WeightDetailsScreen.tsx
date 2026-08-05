import type { WeightsEntryResponse } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';
import { WeightDetailsContent } from '../components/WeightDetailsContent';
import { useWeightDetails } from '../hooks/useWeightDetails';

interface WeightDetailsScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  date: string;
  initialNotice?: string;
  onDeleted: () => void;
  onEdit: (entry: WeightsEntryResponse) => void;
  previousWeightKg?: number;
}

export function WeightDetailsScreen({
  auth,
  colors,
  date,
  initialNotice,
  onDeleted,
  onEdit,
  previousWeightKg,
}: WeightDetailsScreenProps) {
  const details = useWeightDetails({
    auth,
    date,
    initialNotice,
    onDeleted,
    previousWeightKg,
  });

  if (details.loading && !details.entry) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading entry" />
      </Screen>
    );
  }

  if (details.error || !details.entry) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={details.retry}
          title={details.error ?? 'Weight entry was not found.'}
        />
      </Screen>
    );
  }

  const entry = details.entry;

  return (
    <WeightDetailsContent
      changeKg={details.changeKg}
      colors={colors}
      deleting={details.deleting}
      entry={entry}
      notice={details.notice}
      onDelete={details.confirmDelete}
      onEdit={() => onEdit(entry)}
      onRefresh={details.refresh}
      refreshing={details.refreshing}
    />
  );
}
