import { Flashlight } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { PrimaryButton } from '@/components';
import type { ThemeColors } from '@/theme';

const BARCODE_TYPES = ['ean-13', 'ean-8', 'upc-a', 'upc-e'] as const;

interface ScannerCameraProps {
  active: boolean;
  colors: ThemeColors;
  loading: boolean;
  onCameraError: () => void;
  onEnterManually: () => void;
  onReadCode: (code: string) => void;
  onToggleTorch: () => void;
  torchEnabled: boolean;
}

export function ScannerCamera({
  active,
  colors,
  loading,
  onCameraError,
  onEnterManually,
  onReadCode,
  onToggleTorch,
  torchEnabled,
}: ScannerCameraProps) {
  const { width } = useWindowDimensions();
  const frameWidth = Math.max(160, Math.min(300, width - 40));

  return (
    <View style={styles.container}>
      {active ? (
        <Camera
          allowedBarcodeTypes={[...BARCODE_TYPES]}
          barcodeFrameSize={{
            height: Math.min(150, frameWidth / 2),
            width: frameWidth,
          }}
          cameraType={CameraType.Back}
          frameColor={colors.accent}
          laserColor={colors.accent}
          onError={onCameraError}
          onReadCode={event => onReadCode(event.nativeEvent.codeStringValue)}
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
          onPress={onToggleTorch}
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
  topActions: {
    alignItems: 'flex-end',
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
