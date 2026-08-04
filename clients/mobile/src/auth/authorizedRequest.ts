import { ApiError } from '@weight-tracker/api-client';
import type { AuthSessionController } from './useAuthSession';

export async function runAuthorized<T>(
  auth: AuthSessionController,
  request: (accessToken: string) => Promise<T>,
): Promise<T | undefined> {
  const accessToken = await auth.getAccessToken();

  if (!accessToken) {
    return undefined;
  }

  try {
    return await request(accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await auth.expireSession();
      return undefined;
    }

    throw error;
  }
}
