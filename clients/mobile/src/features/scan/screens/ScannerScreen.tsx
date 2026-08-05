import { useIsFocused } from '@react-navigation/native';
import type { Product } from '@weight-tracker/api-client';
import { Flashlight } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import type { AuthSessionController } from '@/auth';
import { PrimaryButton, Screen, ScreenState, TextButton } from '@/components';
import type { ThemeColors } from '@/theme';
import { useCameraPermission } from '../hooks/useCameraPermission';
import { useProductLookup } from '../hooks/useProductLookup';

const BARCODE_TYPES = ['ean-13', 'ean-8', 'upc-a', 'upc-e'] as const;

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
  const isFocused = useIsFocused();
  const permission = useCameraPermission();
  const { clearError, error, loading, lookup } = useProductLookup(auth);
  const processing = useRef(false);
  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );
  const [cameraUnavailable, setCameraUnavailable] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setAppActive(state === 'active');
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isFocused) {
      processing.current = false;
      clearError();
      setCameraUnavailable(false);
    } else {
      setTorchEnabled(false);
    }
  }, [clearError, isFocused]);

  async function handleBarcode(code: string) {
    const normalizedCode = code.trim();

    if (processing.current || !/^\d+$/.test(normalizedCode)) {
      return;
    }

    processing.current = true;
    const product = await lookup(normalizedCode);

    if (product) {
      onProductFound(product);
    }
  }

  function scanAgain() {
    processing.current = false;
    clearError();
  }

  if (permission.state === 'checking') {
    return (
      <Screen centered>
        <ScreenState
          colors={colors}
          kind="loading"
          title="Checking camera access"
        />
      </Screen>
    );
  }

  if (permission.state !== 'granted' || cameraUnavailable) {
    const blocked = permission.state === 'blocked';
    const unavailable = permission.state === 'unavailable' || cameraUnavailable;

    return (
      <Screen centered>
        <ScreenState
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
              ? permission.openApplicationSettings
              : permission.requestAccess
          }
          title={unavailable ? 'Camera is unavailable' : 'Camera access needed'}
        />
        <TextButton
          colors={colors}
          label="Enter barcode manually"
          onPress={onEnterManually}
          style={styles.stateAction}
        />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Scan again"
          colors={colors}
          kind="error"
          onAction={scanAgain}
          title={error}
        />
        <TextButton
          colors={colors}
          label="Enter barcode manually"
          onPress={onEnterManually}
          style={styles.stateAction}
        />
      </Screen>
    );
  }

  const cameraActive = isFocused && appActive;

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <Camera
          allowedBarcodeTypes={[...BARCODE_TYPES]}
          barcodeFrameSize={{ height: 150, width: 300 }}
          cameraType={CameraType.Back}
          frameColor={colors.accent}
          laserColor={colors.accent}
          onError={() => setCameraUnavailable(true)}
          onReadCode={event => handleBarcode(event.nativeEvent.codeStringValue)}
          resizeMode="cover"
          scanBarcode={!loading}
          scanThrottleDelay={1200}
          showFrame
          style={StyleSheet.absoluteFill}
          torchMode={torchEnabled ? 'on' : 'off'}
        />
      ) : null}

      <View style={styles.topActions}>
        <Pressable
          accessibilityLabel={
            torchEnabled ? 'Turn off flashlight' : 'Turn on flashlight'
          }
          accessibilityRole="button"
          accessibilityState={{ checked: torchEnabled }}
          onPress={() => setTorchEnabled(value => !value)}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}
        >
          <Flashlight color="#ffffff" size={22} strokeWidth={2} />
        </Pressable>
      </View>

      {loading ? (
        <View accessibilityLiveRegion="polite" style={styles.loadingOverlay}>
          <ActivityIndicator color="#ffffff" size="large" />
          <Text style={styles.loadingText}>Loading product</Text>
        </View>
      ) : null}

      <View style={styles.bottomActions}>
        <PrimaryButton
          colors={colors}
          disabled={loading}
          label="Enter barcode manually"
          loading={false}
          onPress={onEnterManually}
          style={styles.manualButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomActions: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    bottom: 0,
    left: 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    position: 'absolute',
    right: 0,
  },
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.56)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  loadingOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 12,
  },
  manualButton: {
    maxWidth: 360,
  },
  pressed: {
    opacity: 0.72,
  },
  stateAction: {
    marginTop: 12,
  },
  topActions: {
    alignItems: 'flex-end',
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
