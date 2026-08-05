import type { CalorieEntryResponse } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import { useInitialNotice } from '@/hooks/useInitialNotice';
import type { ThemeColors } from '@/theme';
import { DailyCaloriesContent } from '../components/DailyCaloriesContent';
import { useDailyCalories } from '../hooks/useDailyCalories';

interface DailyCaloriesScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  date: string;
  initialNotice?: string;
  onAddEntry: () => void;
  onOpenEntry: (entry: CalorieEntryResponse) => void;
}

export function DailyCaloriesScreen({
  auth,
  colors,
  date,
  initialNotice,
  onAddEntry,
  onOpenEntry,
}: DailyCaloriesScreenProps) {
  const details = useDailyCalories(auth, date);
  const { notice } = useInitialNotice(initialNotice);

  if (details.loading && !details.day) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading day" />
      </Screen>
    );
  }

  if (details.error || !details.day) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={details.retry}
          title={details.error ?? 'Unable to load this day.'}
        />
      </Screen>
    );
  }

  return (
    <DailyCaloriesContent
      colors={colors}
      day={details.day}
      notice={notice}
      onAddEntry={onAddEntry}
      onOpenEntry={onOpenEntry}
      onRefresh={details.refresh}
      refreshing={details.refreshing}
    />
  );
}
