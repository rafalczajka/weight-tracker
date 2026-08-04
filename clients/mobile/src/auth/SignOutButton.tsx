import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { ThemeColors } from '@/theme';

interface SignOutButtonProps {
  colors: ThemeColors;
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
}

export function SignOutButton({
  colors,
  disabled,
  loading,
  onPress,
}: SignOutButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Sign out"
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.muted} size="small" />
      ) : (
        <Text style={[styles.text, { color: colors.muted }]}>Sign out</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 44,
    justifyContent: 'center',
    minWidth: 80,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.82,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
});
