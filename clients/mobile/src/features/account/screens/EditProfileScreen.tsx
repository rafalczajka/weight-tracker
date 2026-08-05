import { useNavigation, usePreventRemove } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert } from 'react-native';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';
import type { AccountStackParamList } from '../AccountNavigator';
import { ProfileForm } from '../components/ProfileForm';
import { useEditProfile } from '../hooks/useEditProfile';

interface EditProfileScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onSaved: (message: string) => void;
}

export function EditProfileScreen({
  auth,
  colors,
  onSaved,
}: EditProfileScreenProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<AccountStackParamList>>();
  const profile = useEditProfile({ auth, onSaved });

  usePreventRemove(profile.dirty, ({ data }) => {
    Alert.alert(
      'Discard changes?',
      'Your unsaved profile changes will be lost.',
      [
        { style: 'cancel', text: 'Keep editing' },
        {
          onPress: () => navigation.dispatch(data.action),
          style: 'destructive',
          text: 'Discard',
        },
      ],
    );
  });

  if (profile.loading && !profile.profile) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading profile" />
      </Screen>
    );
  }

  if (!profile.profile) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={profile.retry}
          title={profile.error ?? 'Unable to load your profile.'}
        />
      </Screen>
    );
  }

  if (!profile.values) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Preparing profile" />
      </Screen>
    );
  }

  return (
    <ProfileForm
      birthDateBounds={profile.birthDateBounds}
      colors={colors}
      disabled={profile.submitting || profile.authBusy}
      errors={profile.errors}
      notice={
        profile.notice ??
        (profile.error ? { kind: 'error', text: profile.error } : null)
      }
      onChange={profile.changeValue}
      onClear={profile.confirmClear}
      onSubmit={profile.save}
      onValidate={profile.validateField}
      submitting={profile.submitting}
      values={profile.values}
    />
  );
}
