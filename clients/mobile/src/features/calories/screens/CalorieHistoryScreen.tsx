import React from 'react';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';
import { CalorieHistoryContent } from '../components/CalorieHistoryContent';
import { useCalorieHistory } from '../hooks/useCalorieHistory';

interface CalorieHistoryScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddEntry: () => void;
  onOpenDay: (date: string) => void;
}

export function CalorieHistoryScreen({
  auth,
  colors,
  onAddEntry,
  onOpenDay,
}: CalorieHistoryScreenProps) {
  const history = useCalorieHistory(auth);

  if (history.loading && !history.result) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading calories" />
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
    <CalorieHistoryContent
      colors={colors}
      history={history}
      onAddEntry={onAddEntry}
      onOpenDay={onOpenDay}
    />
  );
}
