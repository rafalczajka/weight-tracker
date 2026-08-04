import { useFocusEffect } from '@react-navigation/native';
import {
  getWeights,
  withBearerToken,
  type WeightsGetResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/apiClient';
import type { AuthSessionController } from '@/auth';
import { runAuthorized } from '@/auth';
import type { DateRange } from '@/components';
import { useRequestController } from '@/hooks/useRequestController';

const INITIAL_LIMIT = 10;

export function useWeightHistory(auth: AuthSessionController) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [range, setRange] = useState<DateRange>({});
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [result, setResult] = useState<WeightsGetResponse | null>(null);
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
            const response = await getWeights({
              ...withBearerToken(apiClient, accessToken),
              query: {
                ...(range.from ? { from: range.from } : {}),
                ...(range.to ? { to: range.to } : {}),
                limit,
              },
              signal: controller.signal,
            });

            return response.data;
          },
        );

        if (loadedResult && !controller.signal.aborted) {
          setResult(loadedResult);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Unable to load weight history.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [limit, range.from, range.to, startRequest],
  );

  useFocusEffect(
    useCallback(() => {
      load();

      return abortRequest;
    }, [abortRequest, load]),
  );

  function applyRange(nextRange: DateRange) {
    setLimit(INITIAL_LIMIT);
    setRange(nextRange);
  }

  return {
    applyRange,
    error,
    hasMore: Boolean(result && result.data.length === limit),
    limit,
    loadMore: () => setLimit(value => value + INITIAL_LIMIT),
    loading,
    range,
    refresh: () => load(true),
    refreshing,
    result,
    retry: () => load(),
  };
}
