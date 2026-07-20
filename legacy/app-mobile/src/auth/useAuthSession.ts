import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import {
  getValidSession,
  isAuthenticationCancelled,
  restoreSession,
  signIn as authenticate,
  signOut as clearAuthentication,
  type AuthSession,
} from './authClient';

type AuthOperation = 'restoring' | 'signing-in' | 'signing-out' | null;

export type AuthStatus = 'restoring' | 'signed-out' | 'signed-in';

export interface AuthNotice {
  kind: 'error' | 'info' | 'success';
  text: string;
}

export interface AuthSessionController {
  status: AuthStatus;
  notice: AuthNotice | null;
  busy: boolean;
  signingIn: boolean;
  signingOut: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  expireSession: () => Promise<void>;
}

export function useAuthSession(): AuthSessionController {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [operation, setOperation] = useState<AuthOperation>('restoring');
  const [notice, setNotice] = useState<AuthNotice | null>(null);

  useEffect(() => {
    let active = true;

    async function restoreAuthentication() {
      try {
        const restoredSession = await restoreSession();

        if (active) {
          setSession(restoredSession);
        }
      } catch {
        if (active) {
          setNotice({
            kind: 'error',
            text: 'Unable to restore sign-in. Check your connection.',
          });
        }
      } finally {
        if (active) {
          setOperation(null);
        }
      }
    }

    restoreAuthentication();

    return () => {
      active = false;
    };
  }, []);

  async function signIn() {
    if (operation) {
      return;
    }

    setOperation('signing-in');
    setNotice(null);

    try {
      setSession(await authenticate());
    } catch (error) {
      if (!isAuthenticationCancelled(error)) {
        setNotice({ kind: 'error', text: 'Sign-in failed. Try again.' });
      }
    } finally {
      setOperation(null);
    }
  }

  async function signOut() {
    if (operation) {
      return;
    }

    Keyboard.dismiss();
    setOperation('signing-out');
    setNotice(null);

    try {
      await clearAuthentication();
      setSession(null);
    } catch {
      setNotice({ kind: 'error', text: 'Unable to sign out. Try again.' });
    } finally {
      setOperation(null);
    }
  }

  async function getAccessToken(): Promise<string | null> {
    if (!session) {
      await expireSession();
      return null;
    }

    setNotice(null);
    const activeSession = await getValidSession(session);

    if (!activeSession) {
      await expireSession();
      return null;
    }

    setSession(activeSession);
    return activeSession.accessToken;
  }

  async function expireSession() {
    await clearAuthentication().catch(() => undefined);
    setSession(null);
    setNotice({ kind: 'error', text: 'Your sign-in has expired.' });
  }

  return {
    status:
      operation === 'restoring'
        ? 'restoring'
        : session
        ? 'signed-in'
        : 'signed-out',
    notice,
    busy: operation !== null,
    signingIn: operation === 'signing-in',
    signingOut: operation === 'signing-out',
    signIn,
    signOut,
    getAccessToken,
    expireSession,
  };
}
