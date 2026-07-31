import { createClient, type Auth, type Client } from './generated/client';

export interface WeightTrackerClientOptions {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
}

export type ValidationErrors = Readonly<Record<string, readonly string[]>>;

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly validationErrors: ValidationErrors | undefined;

  constructor(
    message: string,
    status?: number,
    validationErrors?: ValidationErrors,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
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

    const validationProblem = parseValidationProblem(error);

    return new ApiError(
      validationProblem?.title ??
        (response
          ? `Server responded with an error (${response.status}).`
          : 'Weight API request failed.'),
      response?.status,
      validationProblem?.errors,
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

interface ValidationProblem {
  errors: ValidationErrors;
  title?: string;
}

function parseValidationProblem(error: unknown): ValidationProblem | undefined {
  if (!isRecord(error) || !isRecord(error.errors)) {
    return undefined;
  }

  const errors: Record<string, string[]> = {};

  for (const [field, messages] of Object.entries(error.errors)) {
    if (
      !Array.isArray(messages) ||
      !messages.every(message => typeof message === 'string')
    ) {
      return undefined;
    }

    errors[field] = [...messages];
  }

  return {
    errors,
    ...(typeof error.title === 'string' ? { title: error.title } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
