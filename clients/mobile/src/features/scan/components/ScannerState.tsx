import React from 'react';
import { StyleSheet } from 'react-native';
import { Screen, ScreenState, TextButton } from '@/components';
import type { ThemeColors } from '@/theme';

interface ScannerStateProps {
  actionLabel?: string;
  colors: ThemeColors;
  kind: 'error' | 'loading' | 'unavailable';
  message?: string;
  onAction?: () => void;
  onEnterManually?: () => void;
  title: string;
}

export function ScannerState({
  actionLabel,
  colors,
  kind,
  message,
  onAction,
  onEnterManually,
  title,
}: ScannerStateProps) {
  return (
    <Screen centered>
      <ScreenState
        actionLabel={actionLabel}
        colors={colors}
        kind={kind}
        message={message}
        onAction={onAction}
        title={title}
      />
      {onEnterManually ? (
        <TextButton
          colors={colors}
          label="Enter barcode manually"
          onPress={onEnterManually}
          style={styles.manualAction}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  manualAction: {
    marginTop: 12,
  },
});
