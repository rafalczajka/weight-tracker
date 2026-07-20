import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SignOutButton, type AuthNotice } from '../../auth';
import { StatusNotice, type ThemeColors } from '../../ui';

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
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Account</Text>
        <SignOutButton
          colors={colors}
          disabled={disabled}
          loading={loading}
          onPress={onSignOut}
        />
        <StatusNotice colors={colors} notice={notice} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    maxWidth: 420,
    paddingHorizontal: 24,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32,
    paddingTop: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: 12,
    textAlign: 'center',
  },
});
