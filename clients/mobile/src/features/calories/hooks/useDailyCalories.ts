import { useFocusEffect } from '@react-navigation/native';
import {
  getDailyCalories,
  withBearerToken,
  type DailyCaloriesResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { useRequestController } from '@/hooks/useRequestController';
import { getRequestErrorMessage } from '@/network';

export function useDailyCalories(auth: AuthSessionController, date: string) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [day, setDay] = useState<DailyCaloriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { abortRequest, startRequest } = useRequestController();

  const load = useCallback(
    async (refresh = false) => {
      const controller = startRequest();
      refresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      try {
        const loadedDay = await runAuthorized(
          authRef.current,
          async accessToken => {
            const response = await getDailyCalories({
              ...withBearerToken(apiClient, accessToken),
              path: { date },
              signal: controller.signal,
            });

            return response.data;
          },
        );

        if (loadedDay && !controller.signal.aborted) {
          setDay(loadedDay);
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            getRequestErrorMessage(
              requestError,
              'Unable to load calorie entries.',
            ),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [date, startRequest],
  );

  useFocusEffect(
    useCallback(() => {
      load();

      return abortRequest;
    }, [abortRequest, load]),
  );

  return {
    day,
    error,
    loading,
    refresh: () => load(true),
    refreshing,
    retry: () => load(),
  };
}
