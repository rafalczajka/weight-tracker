import {
  calculateCalories,
  withBearerToken,
  type CalorieResult,
} from '@weight-tracker/api-client';
import { apiClient } from '@/apiClient';
import type { AuthSessionController } from '@/auth';
import { useCalculationRequest } from './useCalculationRequest';

export function useCalorieCalculation(
  auth: AuthSessionController,
  revision: number,
) {
  return useCalculationRequest<CalorieResult>({
    auth,
    kind: 'calories',
    request: async (accessToken, signal) => {
      const response = await calculateCalories({
        ...withBearerToken(apiClient, accessToken),
        body: {},
        signal,
      });
      return response.data;
    },
    revision,
  });
}
