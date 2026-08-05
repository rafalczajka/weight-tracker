import React from 'react';
import { Alert } from 'react-native';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import { useInitialNotice } from '@/hooks/useInitialNotice';
import { useMutationTracker } from '@/mutations';
import type { ThemeColors } from '@/theme';
import { ProfileSummaryContent } from '../components/ProfileSummaryContent';
import { useUserProfile } from '../hooks/useUserProfile';

interface AccountScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  initialNotice?: string;
  onEdit: () => void;
}

export function AccountScreen({
  auth,
  colors,
  initialNotice,
  onEdit,
}: AccountScreenProps) {
  const profileState = useUserProfile(auth);
  const mutations = useMutationTracker();
  const { notice } = useInitialNotice(initialNotice);

  function confirmSignOut() {
    Alert.alert('Sign out?', 'You will need to sign in again to use the app.', [
      { style: 'cancel', text: 'Cancel' },
      { style: 'destructive', text: 'Sign out', onPress: auth.signOut },
    ]);
  }

  if (profileState.loading && !profileState.profile) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading profile" />
      </Screen>
    );
  }

  if (!profileState.profile) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={profileState.retry}
          title={profileState.error ?? 'Unable to load your profile.'}
        />
      </Screen>
    );
  }

  return (
    <ProfileSummaryContent
      authNotice={auth.notice}
      colors={colors}
      loadError={profileState.error}
      notice={notice}
      onEdit={onEdit}
      onRefresh={profileState.refresh}
      onSignOut={confirmSignOut}
      profile={profileState.profile}
      refreshing={profileState.refreshing}
      signOutDisabled={auth.busy || mutations.busy}
      signingOut={auth.signingOut}
    />
  );
}
