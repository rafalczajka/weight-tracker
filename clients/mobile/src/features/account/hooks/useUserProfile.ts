import { useFocusEffect } from '@react-navigation/native';
import {
  getUserProfile,
  withBearerToken,
  type UserResponse,
} from '@weight-tracker/api-client';
import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { useRequestController } from '@/hooks/useRequestController';

export function useUserProfile(auth: AuthSessionController) {
  const authRef = useRef(auth);
  authRef.current = auth;
  const [profile, setProfile] = useState<UserResponse | null>(null);
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
        const loadedProfile = await runAuthorized(
          authRef.current,
          async accessToken => {
            const response = await getUserProfile({
              ...withBearerToken(apiClient, accessToken),
              signal: controller.signal,
            });

            return response.data;
          },
        );

        if (loadedProfile && !controller.signal.aborted) {
          setProfile(loadedProfile);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Unable to load your profile.');
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
    error,
    loading,
    profile,
    refresh: () => load(true),
    refreshing,
    retry: () => load(),
  };
}
