import config from '../config.json';

const REQUEST_TIMEOUT_MS = 15_000;

export type AddWeightResult = 'created' | 'already-exists';

export class ApiError extends Error {
  constructor(public readonly status?: number) {
    super(
      status
        ? `Weight API request failed with status ${status}.`
        : 'Weight API request failed.',
    );
    this.name = 'ApiError';
  }
}

export async function addTodayWeight(
  weight: number,
  accessToken: string,
): Promise<AddWeightResult> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.api.baseUrl}/api/weights`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weight }),
      signal: abortController.signal,
    });

    if (response.status === 201) {
      return 'created';
    }

    if (response.status === 409) {
      return 'already-exists';
    }

    throw new ApiError(response.status);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError();
  } finally {
    clearTimeout(timeout);
  }
}
