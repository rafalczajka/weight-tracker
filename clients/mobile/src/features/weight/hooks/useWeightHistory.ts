import { useFocusEffect } from '@react-navigation/native';
import {
  getWeights,
  withBearerToken,
  type WeightsGetResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '../../../api-client';
import type { AuthSessionController } from '../../../auth';
import { runAuthorized } from '../../../auth';
import type { DateRange } from '../../../components';

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

  const load = useCallback(
    async (signal?: AbortSignal, refresh = false) => {
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
              signal,
            });

            return response.data;
          },
        );

        if (loadedResult && !signal?.aborted) {
          setResult(loadedResult);
        }
      } catch {
        if (!signal?.aborted) {
          setError('Unable to load weight history.');
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [limit, range.from, range.to],
  );

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      load(controller.signal);

      return () => controller.abort();
    }, [load]),
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
    refresh: () => load(undefined, true),
    refreshing,
    result,
    retry: () => load(),
  };
}
