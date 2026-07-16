import React from 'react';
import { SignOutButton, type AuthSessionController } from './auth';
import { useWeightEntry, WeightEntryScreen } from './features/weight-entry';
import type { ThemeColors } from './ui';

interface AuthenticatedViewProps {
  auth: AuthSessionController;
  colors: ThemeColors;
}

export function AuthenticatedView({ auth, colors }: AuthenticatedViewProps) {
  const weightEntry = useWeightEntry({
    getAccessToken: auth.getAccessToken,
    onUnauthorized: auth.expireSession,
  });

  return (
    <>
      <WeightEntryScreen
        colors={colors}
        controller={weightEntry}
        disabled={auth.busy}
        notice={auth.notice ?? weightEntry.notice}
      />
      <SignOutButton
        colors={colors}
        disabled={auth.busy || weightEntry.submitting}
        loading={auth.signingOut}
        onPress={auth.signOut}
      />
    </>
  );
}
