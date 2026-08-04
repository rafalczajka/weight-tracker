import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '@/theme';
import { PrimaryButton } from './PrimaryButton';

type ScreenStateKind = 'empty' | 'error' | 'loading' | 'unavailable';

interface ScreenStateProps {
  actionDisabled?: boolean;
  actionLabel?: string;
  colors: ThemeColors;
  kind?: ScreenStateKind;
  message?: string;
  onAction?: () => void;
  title?: string;
}

export function ScreenState({
  actionDisabled = false,
  actionLabel,
  colors,
  kind = 'empty',
  message,
  onAction,
  title,
}: ScreenStateProps) {
  const textColor = kind === 'error' ? colors.error : colors.muted;

  return (
    <View
      accessibilityLiveRegion={kind === 'error' ? 'assertive' : 'polite'}
      style={styles.container}
    >
      {kind === 'loading' ? (
        <ActivityIndicator
          accessibilityLabel={title ?? 'Loading'}
          color={colors.accent}
          size="large"
        />
      ) : null}
      {title ? (
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      ) : null}
      {message ? (
        <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton
          colors={colors}
          disabled={actionDisabled}
          label={actionLabel}
          loading={false}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    marginTop: 24,
    maxWidth: 240,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  message: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
});
