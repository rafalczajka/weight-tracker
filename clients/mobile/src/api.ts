import {
  ApiError,
  createWeightEntry,
  createWeightTrackerClient,
  getWeights,
  withBearerToken,
  type WeightsGetResponse,
} from '@weight-tracker/api-client';
import config from '@weight-tracker/client-config';

export { ApiError } from '@weight-tracker/api-client';

export type AddWeightResult = 'created' | 'already-exists';

export interface WeightHistoryQuery {
  from?: string;
  to?: string;
}

const client = createWeightTrackerClient({
  baseUrl: config.api.baseUrl,
});

export async function addTodayWeight(
  weightKg: number,
  accessToken: string,
): Promise<AddWeightResult> {
  try {
    await createWeightEntry({
      ...withBearerToken(client, accessToken),
      body: { weightKg },
    });

    return 'created';
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return 'already-exists';
    }

    throw error;
  }
}

export async function getWeightHistory(
  accessToken: string,
  query: WeightHistoryQuery,
  signal: AbortSignal,
): Promise<WeightsGetResponse> {
  const response = await getWeights({
    ...withBearerToken(client, accessToken),
    query,
    signal,
  });

  return response.data;
}
