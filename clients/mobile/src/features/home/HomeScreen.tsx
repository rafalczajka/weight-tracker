import React from 'react';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';
import { HomeContent } from './components/HomeContent';
import { useHomeData } from './hooks/useHomeData';

interface HomeScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddCalories: (date: string) => void;
  onAddWeight: (date: string) => void;
  onOpenCalories: (date: string) => void;
  onEditWeight: (date: string, weightKg: number) => void;
  onOpenBmiCalculator: () => void;
  onOpenCalorieCalculator: () => void;
  onScanProduct: () => void;
  onOpenProteinCalculator: () => void;
}

export function HomeScreen({
  auth,
  colors,
  onAddCalories,
  onAddWeight,
  onOpenCalories,
  onEditWeight,
  onOpenBmiCalculator,
  onOpenCalorieCalculator,
  onScanProduct,
  onOpenProteinCalculator,
}: HomeScreenProps) {
  const home = useHomeData(auth);

  if (home.loading && !home.data) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading today" />
      </Screen>
    );
  }

  if (home.error && !home.data) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={home.retry}
          title={home.error}
        />
      </Screen>
    );
  }

  if (!home.data) {
    return null;
  }

  return (
    <HomeContent
      calories={home.data.calories}
      colors={colors}
      date={home.data.date}
      error={home.error}
      onAddCalories={onAddCalories}
      onAddWeight={onAddWeight}
      onEditWeight={onEditWeight}
      onOpenBmiCalculator={onOpenBmiCalculator}
      onOpenCalorieCalculator={onOpenCalorieCalculator}
      onOpenCalories={onOpenCalories}
      onOpenProteinCalculator={onOpenProteinCalculator}
      onRefresh={home.refresh}
      onScanProduct={onScanProduct}
      refreshing={home.refreshing}
      weight={home.data.weight}
    />
  );
}
