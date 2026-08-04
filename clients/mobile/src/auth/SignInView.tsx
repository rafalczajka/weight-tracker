import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, StatusNotice } from '../components';
import type { ThemeColors } from '../theme';
import type { AuthNotice } from './useAuthSession';

interface SignInViewProps {
  colors: ThemeColors;
  disabled: boolean;
  loading: boolean;
  notice: AuthNotice | null;
  onSignIn: () => void;
}

export function SignInView({
  colors,
  disabled,
  loading,
  notice,
  onSignIn,
}: SignInViewProps) {
  return (
    <View style={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>
        Sign in to continue
      </Text>
      <PrimaryButton
        colors={colors}
        disabled={disabled}
        label="Sign in"
        loading={loading}
        onPress={onSignIn}
        style={styles.button}
      />
      <StatusNotice colors={colors} notice={notice} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
});
