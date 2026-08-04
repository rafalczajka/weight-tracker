import React, { type PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface IconButtonProps extends PropsWithChildren {
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
}

export function IconButton({
  accessibilityLabel,
  children,
  disabled = false,
  onPress,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.65,
  },
});
