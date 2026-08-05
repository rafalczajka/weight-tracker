import type { Product } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import type { ThemeColors } from '@/theme';
import { ScannerCamera } from '../components/ScannerCamera';
import { ScannerState } from '../components/ScannerState';
import { useScanner } from '../hooks/useScanner';

interface ScannerScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onEnterManually: () => void;
  onProductFound: (product: Product) => void;
}

export function ScannerScreen({
  auth,
  colors,
  onEnterManually,
  onProductFound,
}: ScannerScreenProps) {
  const scanner = useScanner({ auth, onProductFound });
  const permissionState = scanner.permission.state;

  if (permissionState === 'checking') {
    return (
      <ScannerState
        colors={colors}
        kind="loading"
        title="Checking camera access"
      />
    );
  }

  if (permissionState !== 'granted' || scanner.cameraUnavailable) {
    const blocked = permissionState === 'blocked';
    const unavailable =
      permissionState === 'unavailable' || scanner.cameraUnavailable;

    return (
      <ScannerState
        actionLabel={
          unavailable ? undefined : blocked ? 'Open settings' : 'Try again'
        }
        colors={colors}
        kind="unavailable"
        message={
          unavailable
            ? 'Use manual entry to look up a product.'
            : 'Camera access is required to scan product barcodes.'
        }
        onAction={
          blocked
            ? scanner.permission.openApplicationSettings
            : scanner.permission.requestAccess
        }
        onEnterManually={onEnterManually}
        title={unavailable ? 'Camera is unavailable' : 'Camera access needed'}
      />
    );
  }

  if (scanner.error) {
    return (
      <ScannerState
        actionLabel="Scan again"
        colors={colors}
        kind="error"
        onAction={scanner.scanAgain}
        onEnterManually={onEnterManually}
        title={scanner.error}
      />
    );
  }

  return (
    <ScannerCamera
      active={scanner.cameraActive}
      colors={colors}
      loading={scanner.loading}
      onCameraError={scanner.markCameraUnavailable}
      onEnterManually={onEnterManually}
      onReadCode={scanner.handleBarcode}
      onToggleTorch={scanner.toggleTorch}
      torchEnabled={scanner.torchEnabled}
    />
  );
}
