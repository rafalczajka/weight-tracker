export * from './generated';
export { createClient, type Auth, type Client } from './generated/client';

export {
  ApiError,
  createWeightTrackerClient,
  withBearerToken,
  type ValidationErrors,
  type WeightTrackerClientOptions,
} from './client';
