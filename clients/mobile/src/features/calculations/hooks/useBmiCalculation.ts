import {
  calculateBmi,
  withBearerToken,
  type BmiPostResponse,
} from '@weight-tracker/api-client';
import { apiClient } from '@/apiClient';
import type { AuthSessionController } from '@/auth';
import { useCalculationRequest } from './useCalculationRequest';

export function useBmiCalculation(
  auth: AuthSessionController,
  revision: number,
) {
  return useCalculationRequest<BmiPostResponse>({
    auth,
    kind: 'bmi',
    request: async (accessToken, signal) => {
      const response = await calculateBmi({
        ...withBearerToken(apiClient, accessToken),
        body: {},
        signal,
      });
      return response.data;
    },
    revision,
  });
}
