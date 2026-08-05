import type { Product } from '@weight-tracker/api-client';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import type { AuthSessionController } from '@/auth';
import { useProductLookup } from './useProductLookup';

interface UseBarcodeFormOptions {
  auth: AuthSessionController;
  onProductFound: (product: Product) => void;
}

export function useBarcodeForm({
  auth,
  onProductFound,
}: UseBarcodeFormOptions) {
  const productLookup = useProductLookup(auth);
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  function changeCode(value: string) {
    setCode(value);
    setValidationError(null);
    productLookup.clearError();
  }

  async function submit() {
    if (productLookup.loading) {
      return;
    }

    const error = getBarcodeError(code);
    setValidationError(error);

    if (error) {
      return;
    }

    Keyboard.dismiss();
    const product = await productLookup.lookup(code.trim());

    if (product) {
      onProductFound(product);
    }
  }

  return {
    changeCode,
    code,
    error: productLookup.error,
    loading: productLookup.loading,
    submit,
    validate: () => setValidationError(getBarcodeError(code)),
    validationError,
  };
}

function getBarcodeError(value: string): string | null {
  const normalized = value.trim();

  if (!normalized) {
    return 'Enter a product barcode.';
  }

  return /^\d+$/.test(normalized) ? null : 'Barcode must contain digits only.';
}
