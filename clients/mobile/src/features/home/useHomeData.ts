import { useFocusEffect } from '@react-navigation/native';
import {
  getDailyCalories,
  getWeightsSummary,
  withBearerToken,
  type DailyCaloriesResponse,
  type WeightSummary,
} from '@weight-tracker/api-client';
import { formatApiDate } from '@weight-tracker/client-core';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { useRequestController } from '@/hooks/useRequestController';

interface HomeData {
  calories: DailyCaloriesResponse;
  date: string;
  weight: WeightSummary;
}

export function useHomeData(auth: AuthSessionController) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { abortRequest, startRequest } = useRequestController();

  const load = useCallback(
    async (refresh = false) => {
      const controller = startRequest();
      const date = formatApiDate(new Date());
      refresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      try {
        const result = await runAuthorized(
          authRef.current,
          async accessToken => {
            const options = withBearerToken(apiClient, accessToken);
            const [weightResponse, caloriesResponse] = await Promise.all([
              getWeightsSummary({ ...options, signal: controller.signal }),
              getDailyCalories({
                ...options,
                path: { date },
                signal: controller.signal,
              }),
            ]);

            return {
              calories: caloriesResponse.data,
              date,
              weight: weightResponse.data,
            };
          },
        );

        if (result && !controller.signal.aborted) {
          setData(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load today's summary.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [startRequest],
  );

  useFocusEffect(
    useCallback(() => {
      load();
      return abortRequest;
    }, [abortRequest, load]),
  );

  return {
    data,
    error,
    loading,
    refresh: () => load(true),
    refreshing,
    retry: () => load(),
  };
}
