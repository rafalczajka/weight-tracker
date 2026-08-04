import { useFocusEffect } from '@react-navigation/native';
import {
  getDailyCalories,
  getWeightsSummary,
  withBearerToken,
  type DailyCaloriesResponse,
  type WeightSummary,
} from '@weight-tracker/api-client';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { apiClient } from '../../api-client';
import { runAuthorized, type AuthSessionController } from '../../auth';
import { ListRow, Screen, ScreenState } from '../../components';
import { formatDisplayDate, getTodayApiDate } from '../../date';
import { formatCaloriesKcal, formatWeightKg } from '../../format';
import type { ThemeColors } from '../../theme';

interface HomeScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddCalories: (date: string) => void;
  onAddWeight: (date: string) => void;
  onOpenCalories: (date: string) => void;
  onEditWeight: (date: string, weightKg: number) => void;
  onScanProduct: () => void;
}

interface HomeData {
  calories: DailyCaloriesResponse;
  weight: WeightSummary;
}

export function HomeScreen({
  auth,
  colors,
  onAddCalories,
  onAddWeight,
  onOpenCalories,
  onEditWeight,
  onScanProduct,
}: HomeScreenProps) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = getTodayApiDate();

  const load = useCallback(async (signal?: AbortSignal, refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const result = await runAuthorized(authRef.current, async accessToken => {
        const options = withBearerToken(apiClient, accessToken);
        const [weightResponse, caloriesResponse] = await Promise.all([
          getWeightsSummary({ ...options, signal }),
          getDailyCalories({
            ...options,
            path: { date: getTodayApiDate() },
            signal,
          }),
        ]);

        return {
          calories: caloriesResponse.data,
          weight: weightResponse.data,
        };
      });

      if (result && !signal?.aborted) {
        setData(result);
      }
    } catch {
      if (!signal?.aborted) {
        setError("Unable to load today's summary.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      load(controller.signal);

      return () => controller.abort();
    }, [load]),
  );

  if (loading && !data) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading today" />
      </Screen>
    );
  }

  if (error && !data) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={() => load()}
          title={error}
        />
      </Screen>
    );
  }

  if (!data) {
    return null;
  }

  const todayWeightKg = data.weight.today.weightKg;
  const weightAction =
    data.weight.today.hasEntry && todayWeightKg != null
      ? () => onEditWeight(data.weight.today.date, todayWeightKg)
      : () => onAddWeight(data.weight.today.date);

  return (
    <Screen onRefresh={() => load(undefined, true)} refreshing={refreshing}>
      <Text style={[styles.date, { color: colors.muted }]}>
        {formatDisplayDate(today)}
      </Text>
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.inlineError, { color: colors.error }]}
        >
          {error}
        </Text>
      ) : null}

      <SectionTitle colors={colors}>Today</SectionTitle>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          onPress={weightAction}
          subtitle={
            data.weight.today.hasEntry ? 'Edit measurement' : 'Add measurement'
          }
          title="Weight"
          value={
            data.weight.today.weightKg == null
              ? 'Not added'
              : formatWeightKg(data.weight.today.weightKg)
          }
        />
        <ListRow
          colors={colors}
          onPress={() =>
            data.calories.entries.length > 0
              ? onOpenCalories(today)
              : onAddCalories(today)
          }
          subtitle={`${data.calories.entries.length} ${
            data.calories.entries.length === 1 ? 'entry' : 'entries'
          }`}
          title="Calories"
          value={formatCaloriesKcal(data.calories.totalCaloriesKcal)}
        />
      </View>

      <SectionTitle colors={colors}>Weight streak</SectionTitle>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          title="Current streak"
          value={formatDays(data.weight.streak.current)}
        />
        <ListRow
          colors={colors}
          title="Longest streak"
          value={formatDays(data.weight.streak.longest)}
        />
      </View>

      <SectionTitle colors={colors}>Quick actions</SectionTitle>
      <View style={[styles.section, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          onPress={() => onAddWeight(today)}
          title="Add weight"
        />
        <ListRow
          colors={colors}
          onPress={() => onAddCalories(today)}
          title="Add calories"
        />
        <ListRow colors={colors} onPress={onScanProduct} title="Scan product" />
      </View>
    </Screen>
  );
}

function formatDays(value: number): string {
  return `${value} ${value === 1 ? 'day' : 'days'}`;
}

function SectionTitle({
  children,
  colors,
}: {
  children: string;
  colors: ThemeColors;
}) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.text }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 15,
    letterSpacing: 0,
  },
  inlineError: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  section: {
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8,
    marginTop: 28,
  },
});
