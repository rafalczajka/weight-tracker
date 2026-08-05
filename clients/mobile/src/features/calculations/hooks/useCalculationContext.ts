import { useFocusEffect } from '@react-navigation/native';
import {
  ApiError,
  getLatestWeightEntry,
  getUserProfile,
  withBearerToken,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { useRequestController } from '@/hooks/useRequestController';
import type { CalculationContextData } from '../requirements';

export function useCalculationContext(auth: AuthSessionController) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [data, setData] = useState<CalculationContextData | null>(null);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { abortRequest, startRequest } = useRequestController();

  const load = useCallback(async () => {
    const controller = startRequest();
    setLoading(true);
    setError(null);

    try {
      const loadedData = await runAuthorized(
        authRef.current,
        async accessToken => {
          const requestOptions = withBearerToken(apiClient, accessToken);
          const [profileResponse, latestWeight] = await Promise.all([
            getUserProfile({
              ...requestOptions,
              signal: controller.signal,
            }),
            loadLatestWeight(accessToken, controller.signal),
          ]);

          return {
            latestWeight,
            profile: profileResponse.data,
          };
        },
      );

      if (loadedData && !controller.signal.aborted) {
        setData(loadedData);
        setRevision(value => value + 1);
      }
    } catch {
      if (!controller.signal.aborted) {
        setError('Unable to load calculation data.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [startRequest]);

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
    retry: load,
    revision,
  };
}

async function loadLatestWeight(accessToken: string, signal: AbortSignal) {
  try {
    const response = await getLatestWeightEntry({
      ...withBearerToken(apiClient, accessToken),
      signal,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
