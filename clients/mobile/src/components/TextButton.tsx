import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ThemeColors } from '@/theme';

interface TextButtonProps {
  colors: ThemeColors;
  destructive?: boolean;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function TextButton({
  colors,
  destructive = false,
  disabled = false,
  label,
  loading = false,
  onPress,
  style,
}: TextButtonProps) {
  const color = destructive ? colors.error : colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} size="small" />
      ) : (
        <Text style={[styles.label, { color }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.65,
  },
});
