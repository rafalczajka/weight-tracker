import {
  ApiError,
  createWeightEntry,
  createWeightTrackerClient,
  withBearerToken,
} from '@weight-tracker/api-client';
import config from '@weight-tracker/client-config';

export { ApiError } from '@weight-tracker/api-client';

export type AddWeightResult = 'created' | 'already-exists';

const client = createWeightTrackerClient({
  baseUrl: config.api.baseUrl,
});

export async function addTodayWeight(
  weight: number,
  accessToken: string,
): Promise<AddWeightResult> {
  try {
    await createWeightEntry({
      ...withBearerToken(client, accessToken),
      body: { weight },
    });

    return 'created';
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return 'already-exists';
    }

    throw error;
  }
}
