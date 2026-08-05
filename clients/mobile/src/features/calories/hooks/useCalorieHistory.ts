import { useFocusEffect } from '@react-navigation/native';
import {
  getCalories,
  withBearerToken,
  type CaloriesGetResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import type { DateRange } from '@/components';
import { useRequestController } from '@/hooks/useRequestController';
import { getRequestErrorMessage } from '@/network';

const INITIAL_DAY_LIMIT = 7;

export function useCalorieHistory(auth: AuthSessionController) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [range, setRange] = useState<DateRange>({});
  const [limitDays, setLimitDays] = useState(INITIAL_DAY_LIMIT);
  const [result, setResult] = useState<CaloriesGetResponse | null>(null);
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
        const loadedResult = await runAuthorized(
          authRef.current,
          async accessToken => {
            const response = await getCalories({
              ...withBearerToken(apiClient, accessToken),
              query: {
                ...(range.from ? { from: range.from } : {}),
                ...(range.to ? { to: range.to } : {}),
                limitDays,
              },
              signal: controller.signal,
            });

            return response.data;
          },
        );

        if (loadedResult && !controller.signal.aborted) {
          setResult(loadedResult);
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            getRequestErrorMessage(
              requestError,
              'Unable to load calorie history.',
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
    [limitDays, range.from, range.to, startRequest],
  );

  useFocusEffect(
    useCallback(() => {
      load();

      return abortRequest;
    }, [abortRequest, load]),
  );

  return {
    applyRange: (nextRange: DateRange) => {
      setLimitDays(INITIAL_DAY_LIMIT);
      setRange(nextRange);
    },
    error,
    hasMore: Boolean(result && result.data.length === limitDays),
    loadMore: () => setLimitDays(value => value + INITIAL_DAY_LIMIT),
    loading,
    range,
    refresh: () => load(true),
    refreshing,
    result,
    retry: () => load(),
  };
}
