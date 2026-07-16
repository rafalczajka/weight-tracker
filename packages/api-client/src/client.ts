import { createClient, type Auth, type Client } from './generated/client';

export interface WeightTrackerClientOptions {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
}

export class ApiError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function createWeightTrackerClient({
  baseUrl,
  fetch: fetchImplementation = globalThis.fetch,
}: WeightTrackerClientOptions): Client {
  const client = createClient({
    baseUrl: baseUrl.replace(/\/+$/, ''),
    fetch: fetchImplementation,
  });

  client.interceptors.error.use((error, response) => {
    if (error instanceof ApiError) {
      return error;
    }

    return new ApiError(
      response
        ? `Server responded with an error (${response.status}).`
        : 'Weight API request failed.',
      response?.status,
    );
  });

  return client;
}

export function withBearerToken(client: Client, accessToken: string) {
  return {
    auth: (auth: Auth) => (auth.scheme === 'bearer' ? accessToken : undefined),
    client,
    throwOnError: true as const,
  };
}
