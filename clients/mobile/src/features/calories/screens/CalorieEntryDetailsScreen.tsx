import type {
  CalorieEntryDetailsResponse,
  CalorieEntryResponse,
} from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';
import { CalorieEntryDetailsContent } from '../components/CalorieEntryDetailsContent';
import { useCalorieEntryDetails } from '../hooks/useCalorieEntryDetails';

interface CalorieEntryDetailsScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  date: string;
  id: string;
  initialNotice?: string;
  onDeleted: () => void;
  onEdit: (entry: CalorieEntryDetailsResponse) => void;
}

export function CalorieEntryDetailsScreen({
  auth,
  colors,
  date,
  id,
  initialNotice,
  onDeleted,
  onEdit,
}: CalorieEntryDetailsScreenProps) {
  const details = useCalorieEntryDetails({
    auth,
    date,
    id,
    initialNotice,
    onDeleted,
  });

  if (details.loading && !details.day) {
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
          title={details.error ?? 'Calorie entry was not found.'}
        />
      </Screen>
    );
  }

  const entry = details.entry;

  return (
    <CalorieEntryDetailsContent
      colors={colors}
      date={date}
      deleting={details.deleting}
      entry={entry}
      notice={details.notice}
      onDelete={details.confirmDelete}
      onEdit={() => onEdit(toEntryDetails(entry, date))}
      onRefresh={details.refresh}
      refreshing={details.refreshing}
    />
  );
}

function toEntryDetails(
  entry: CalorieEntryResponse,
  date: string,
): CalorieEntryDetailsResponse {
  return { ...entry, date };
}
