import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SignOutButton, type AuthNotice } from '../../auth';
import { Screen, StatusNotice } from '../../components';
import type { ThemeColors } from '../../theme';

interface AccountScreenProps {
  colors: ThemeColors;
  disabled: boolean;
  loading: boolean;
  notice: AuthNotice | null;
  onSignOut: () => void;
}

export function AccountScreen({
  colors,
  disabled,
  loading,
  notice,
  onSignOut,
}: AccountScreenProps) {
  return (
    <Screen centered>
      <View style={styles.content}>
        <SignOutButton
          colors={colors}
          disabled={disabled}
          loading={loading}
          onPress={onSignOut}
        />
        <StatusNotice colors={colors} notice={notice} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    maxWidth: 420,
    width: '100%',
  },
});
