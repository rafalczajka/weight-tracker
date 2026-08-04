import { useFocusEffect } from '@react-navigation/native';
import {
  getDailyCalories,
  withBearerToken,
  type DailyCaloriesResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '../../../api-client';
import { runAuthorized, type AuthSessionController } from '../../../auth';

export function useDailyCalories(auth: AuthSessionController, date: string) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [day, setDay] = useState<DailyCaloriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal, refresh = false) => {
      refresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      try {
        const loadedDay = await runAuthorized(
          authRef.current,
          async accessToken => {
            const response = await getDailyCalories({
              ...withBearerToken(apiClient, accessToken),
              path: { date },
              signal,
            });

            return response.data;
          },
        );

        if (loadedDay && !signal?.aborted) {
          setDay(loadedDay);
        }
      } catch {
        if (!signal?.aborted) {
          setError('Unable to load calorie entries.');
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [date],
  );

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      load(controller.signal);

      return () => controller.abort();
    }, [load]),
  );

  return {
    day,
    error,
    loading,
    refresh: () => load(undefined, true),
    refreshing,
    retry: () => load(),
  };
}
