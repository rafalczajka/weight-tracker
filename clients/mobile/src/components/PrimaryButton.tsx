import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ThemeColors } from '@/theme';

interface PrimaryButtonProps {
  colors: ThemeColors;
  disabled: boolean;
  label: string;
  loading: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  colors,
  disabled,
  label,
  loading,
  onPress,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        { backgroundColor: disabled ? colors.buttonDisabled : colors.button },
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.buttonText} />
      ) : (
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 6,
    height: 52,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.82,
  },
});
