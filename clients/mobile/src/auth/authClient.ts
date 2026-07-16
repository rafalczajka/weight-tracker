import {
  authorize,
  refresh,
  type AuthConfiguration,
  type AuthorizeResult,
  type RefreshResult,
} from 'react-native-app-auth';
import * as Keychain from 'react-native-keychain';
import config from '@weight-tracker/client-config';

const TOKEN_SERVICE = 'weight-tracker-auth';
const TOKEN_USERNAME = 'refresh-token';
const EXPIRY_MARGIN_MS = 60_000;
const REDIRECT_URL = 'com.weighttracker.auth://oauth/redirect/';

const authConfiguration: AuthConfiguration = {
  serviceConfiguration: {
    authorizationEndpoint: `https://login.microsoftonline.com/${config.auth.tenantId}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${config.auth.tenantId}/oauth2/v2.0/token`,
  },
  clientId: config.auth.clientId,
  redirectUrl: REDIRECT_URL,
  scopes: [
    'openid',
    'profile',
    'offline_access',
    `api://${config.auth.clientId}/access_as_user`,
  ],
  usePKCE: true,
};

export interface AuthSession {
  accessToken: string;
  expiresAt: number;
}

export async function signIn(): Promise<AuthSession> {
  const result = await authorize(authConfiguration);
  await storeRefreshToken(result.refreshToken);
  return toSession(result);
}

export async function signOut(): Promise<void> {
  await clearRefreshToken();
}

export async function restoreSession(): Promise<AuthSession | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  return refreshWithToken(refreshToken);
}

export async function getValidSession(
  session: AuthSession,
): Promise<AuthSession | null> {
  if (session.expiresAt > Date.now() + EXPIRY_MARGIN_MS) {
    return session;
  }

  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  return refreshWithToken(refreshToken);
}

export function isAuthenticationCancelled(error: unknown): boolean {
  return getErrorCode(error) === 'access_denied';
}

async function refreshWithToken(
  refreshToken: string,
): Promise<AuthSession | null> {
  try {
    const result = await refresh(authConfiguration, { refreshToken });
    await storeRefreshToken(result.refreshToken ?? refreshToken);
    return toSession(result);
  } catch (error) {
    if (isRejectedRefreshToken(error)) {
      await clearRefreshToken();
      return null;
    }

    throw error;
  }
}

async function clearRefreshToken(): Promise<void> {
  await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
}

async function getRefreshToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({
    service: TOKEN_SERVICE,
  });

  return credentials ? credentials.password : null;
}

async function storeRefreshToken(refreshToken: string): Promise<void> {
  if (!refreshToken) {
    return;
  }

  await Keychain.setGenericPassword(TOKEN_USERNAME, refreshToken, {
    service: TOKEN_SERVICE,
  });
}

function toSession(result: AuthorizeResult | RefreshResult): AuthSession {
  const expiresAt = Date.parse(result.accessTokenExpirationDate);

  return {
    accessToken: result.accessToken,
    expiresAt: Number.isNaN(expiresAt) ? Date.now() : expiresAt,
  };
}

function isRejectedRefreshToken(error: unknown): boolean {
  const code = getErrorCode(error);
  return code === 'invalid_grant' || code === 'unauthorized_client';
}

function getErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  return typeof error.code === 'string' ? error.code : null;
}
