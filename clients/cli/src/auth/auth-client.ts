import {
  InteractionRequiredAuthError,
  PublicClientApplication,
} from '@azure/msal-node';
import { openBrowser } from '@/browser';
import { AppError } from '@/errors';
import { createTokenCache } from './token-cache';
import type { AuthClient, AuthClientConfig } from './types';

export function createAuthClient({
  clientId,
  tenantId,
}: AuthClientConfig): AuthClient {
  const scopes = [`api://${clientId}/access_as_user`];
  let statePromise: ReturnType<typeof createAuthState> | undefined;

  const getState = () =>
    (statePromise ??= createAuthState({ clientId, tenantId }));

  return {
    async acquireToken() {
      try {
        const { application } = await getState();
        return await acquireAccessToken(application, scopes);
      } catch (error) {
        throw new AppError(`Authentication failed: ${getErrorMessage(error)}`, {
          cause: error,
        });
      }
    },

    async logout() {
      const { tokenCache } = await getState();
      await tokenCache.clear();
    },
  };
}

async function createAuthState({ clientId, tenantId }: AuthClientConfig) {
  const tokenCache = await createTokenCache();
  const application = new PublicClientApplication({
    auth: {
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientId,
    },
    cache: { cachePlugin: tokenCache.cachePlugin },
  });

  return { application, tokenCache };
}

async function acquireAccessToken(
  application: PublicClientApplication,
  scopes: string[],
): Promise<string> {
  const account = (await application.getAllAccounts())[0];

  if (account) {
    try {
      const result = await application.acquireTokenSilent({ account, scopes });
      return result.accessToken;
    } catch (error) {
      if (!(error instanceof InteractionRequiredAuthError)) {
        throw error;
      }
    }
  }

  const result = await application.acquireTokenInteractive({
    openBrowser,
    scopes,
  });

  return result.accessToken;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unknown authentication error.';
}
