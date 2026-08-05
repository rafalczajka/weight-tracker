import {
  ApiError,
  getFood,
  withBearerToken,
  type Product,
} from '@weight-tracker/api-client';
import { useCallback, useState } from 'react';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import { useRequestController } from '@/hooks/useRequestController';

export function useProductLookup(auth: AuthSessionController) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { startRequest } = useRequestController();
  const clearError = useCallback(() => setError(null), []);

  const lookup = useCallback(
    async (code: string): Promise<Product | null> => {
      const controller = startRequest();
      setError(null);
      setLoading(true);

      try {
        const product = await runAuthorized(auth, async accessToken => {
          const response = await getFood({
            ...withBearerToken(apiClient, accessToken),
            path: { code },
            signal: controller.signal,
          });

          return response.data;
        });

        return controller.signal.aborted ? null : product ?? null;
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(getLookupError(requestError));
        }

        return null;
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [auth, startRequest],
  );

  return {
    clearError,
    error,
    loading,
    lookup,
  };
}

function getLookupError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return 'Product was not found.';
    }

    if (error.status === 502) {
      return 'Product information is temporarily unavailable.';
    }
  }

  return 'Unable to load product. Check your connection and try again.';
}
