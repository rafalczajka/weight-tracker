import { useIsFocused } from '@react-navigation/native';
import type { Product } from '@weight-tracker/api-client';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { AuthSessionController } from '@/auth';
import { useCameraPermission } from './useCameraPermission';
import { useProductLookup } from './useProductLookup';

interface UseScannerOptions {
  auth: AuthSessionController;
  onProductFound: (product: Product) => void;
}

export function useScanner({ auth, onProductFound }: UseScannerOptions) {
  const isFocused = useIsFocused();
  const permission = useCameraPermission();
  const {
    clearError,
    error,
    loading,
    lookup: lookupProduct,
  } = useProductLookup(auth);
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
    const product = await lookupProduct(normalizedCode);

    if (product) {
      onProductFound(product);
    }
  }

  function scanAgain() {
    processing.current = false;
    clearError();
  }

  return {
    cameraActive: isFocused && appActive,
    cameraUnavailable,
    error,
    handleBarcode,
    loading,
    markCameraUnavailable: () => setCameraUnavailable(true),
    permission,
    scanAgain,
    toggleTorch: () => setTorchEnabled(value => !value),
    torchEnabled,
  };
}
