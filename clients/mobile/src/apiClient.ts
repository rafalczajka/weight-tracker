import { createWeightTrackerClient } from '@weight-tracker/api-client';
import config from '@weight-tracker/client-config';

export const apiClient = createWeightTrackerClient({
  baseUrl: config.api.baseUrl,
});
