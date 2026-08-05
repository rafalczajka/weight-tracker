import type { UserResponse } from '@weight-tracker/api-client';
import { formatLabel } from '@weight-tracker/client-core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SignOutButton, type AuthNotice } from '@/auth';
import {
  ListRow,
  Screen,
  StatusNotice,
  TextButton,
  type StatusNoticeValue,
} from '@/components';
import { formatDisplayDate } from '@/date';
import type { ThemeColors } from '@/theme';

interface ProfileSummaryContentProps {
  authNotice: AuthNotice | null;
  colors: ThemeColors;
  loadError: string | null;
  notice: StatusNoticeValue | null;
  onEdit: () => void;
  onRefresh: () => void;
  onSignOut: () => void;
  profile: UserResponse;
  refreshing: boolean;
  signOutDisabled: boolean;
  signingOut: boolean;
}

export function ProfileSummaryContent({
  authNotice,
  colors,
  loadError,
  notice,
  onEdit,
  onRefresh,
  onSignOut,
  profile,
  refreshing,
  signOutDisabled,
  signingOut,
}: ProfileSummaryContentProps) {
  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      {loadError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.loadError, { color: colors.error }]}
        >
          {loadError}
        </Text>
      ) : null}
      <View style={[styles.profile, { borderTopColor: colors.border }]}>
        <ListRow
          colors={colors}
          title="Height"
          value={
            profile.heightCm == null ? 'Not set' : `${profile.heightCm} cm`
          }
        />
        <ListRow
          colors={colors}
          title="Sex"
          value={formatOptionalLabel(profile.sex)}
        />
        <ListRow
          colors={colors}
          title="Date of birth"
          value={
            profile.dateOfBirth
              ? formatDisplayDate(profile.dateOfBirth)
              : 'Not set'
          }
        />
        <ListRow
          colors={colors}
          title="Activity level"
          value={formatOptionalLabel(profile.activityLevel)}
        />
        <ListRow
          colors={colors}
          title="Protein goal"
          value={formatOptionalLabel(profile.proteinGoal)}
        />
      </View>
      <TextButton
        colors={colors}
        label="Edit profile"
        onPress={onEdit}
        style={styles.edit}
      />
      <View style={styles.signOut}>
        <SignOutButton
          colors={colors}
          disabled={signOutDisabled}
          loading={signingOut}
          onPress={onSignOut}
        />
      </View>
      <StatusNotice colors={colors} notice={authNotice ?? notice} />
    </Screen>
  );
}

function formatOptionalLabel(value: string | null | undefined): string {
  return value ? formatLabel(value) : 'Not set';
}

const styles = StyleSheet.create({
  edit: {
    alignSelf: 'center',
    marginTop: 16,
  },
  loadError: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  profile: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  signOut: {
    marginTop: 48,
  },
});
