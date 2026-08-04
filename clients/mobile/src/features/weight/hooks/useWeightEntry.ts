import { useFocusEffect } from '@react-navigation/native';
import {
  getWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '../../../api-client';
import { runAuthorized, type AuthSessionController } from '../../../auth';

export function useWeightEntry(auth: AuthSessionController, date: string) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [entry, setEntry] = useState<WeightsEntryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal, refresh = false) => {
      refresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      try {
        const loadedEntry = await runAuthorized(
          authRef.current,
          async accessToken => {
            const response = await getWeightEntry({
              ...withBearerToken(apiClient, accessToken),
              path: { date },
              signal,
            });

            return response.data;
          },
        );

        if (loadedEntry && !signal?.aborted) {
          setEntry(loadedEntry);
        }
      } catch {
        if (!signal?.aborted) {
          setError('Unable to load this weight entry.');
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
    entry,
    error,
    loading,
    refresh: () => load(undefined, true),
    refreshing,
    retry: () => load(),
  };
}
