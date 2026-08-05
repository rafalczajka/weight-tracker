import {
  calculateProtein,
  withBearerToken,
  type ProteinResult,
} from '@weight-tracker/api-client';
import { apiClient } from '@/apiClient';
import type { AuthSessionController } from '@/auth';
import { useCalculationRequest } from './useCalculationRequest';

export function useProteinCalculation(
  auth: AuthSessionController,
  revision: number,
) {
  return useCalculationRequest<ProteinResult>({
    auth,
    kind: 'protein',
    request: async (accessToken, signal) => {
      const response = await calculateProtein({
        ...withBearerToken(apiClient, accessToken),
        body: {},
        signal,
      });
      return response.data;
    },
    revision,
  });
}
