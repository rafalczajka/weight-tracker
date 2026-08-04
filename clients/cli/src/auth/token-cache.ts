import os from 'node:os';
import path from 'node:path';
import {
  DataProtectionScope,
  FilePersistenceWithDataProtection,
  PersistenceCachePlugin,
} from '@azure/msal-node-extensions';
import { AppError } from '@/errors';

const CACHE_DIRECTORY = 'wtrack';
const CACHE_FILENAME = 'token-cache.bin';

export async function createTokenCache() {
  const cachePath = getTokenCachePath();

  try {
    const persistence = await FilePersistenceWithDataProtection.create(
      cachePath,
      DataProtectionScope.CurrentUser,
    );

    return {
      cachePlugin: new PersistenceCachePlugin(persistence),
      async clear() {
        try {
          await persistence.delete();
        } catch (error) {
          throw new AppError('Unable to clear the authentication cache.', {
            cause: error,
          });
        }
      },
    };
  } catch (error) {
    throw new AppError('Unable to initialize the authentication cache.', {
      cause: error,
    });
  }
}

function getTokenCachePath(): string {
  const localAppData =
    process.env.LOCALAPPDATA ?? path.join(os.homedir(), 'AppData', 'Local');

  return path.join(localAppData, CACHE_DIRECTORY, CACHE_FILENAME);
}
