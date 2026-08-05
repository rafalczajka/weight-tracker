import { useFocusEffect } from '@react-navigation/native';
import {
  getWeightEntry,
  withBearerToken,
  type WeightsEntryResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { useRequestController } from '@/hooks/useRequestController';
import { getRequestErrorMessage } from '@/network';

export function useWeightEntry(auth: AuthSessionController, date: string) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [entry, setEntry] = useState<WeightsEntryResponse | null>(null);
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
        const loadedEntry = await runAuthorized(
          authRef.current,
          async accessToken => {
            const response = await getWeightEntry({
              ...withBearerToken(apiClient, accessToken),
              path: { date },
              signal: controller.signal,
            });

            return response.data;
          },
        );

        if (loadedEntry && !controller.signal.aborted) {
          setEntry(loadedEntry);
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            getRequestErrorMessage(
              requestError,
              'Unable to load this weight entry.',
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
    entry,
    error,
    loading,
    refresh: () => load(true),
    refreshing,
    retry: () => load(),
  };
}
