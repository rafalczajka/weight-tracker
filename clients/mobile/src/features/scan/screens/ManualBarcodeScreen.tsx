import type { Product } from '@weight-tracker/api-client';
import React, { useState } from 'react';
import { Keyboard, View } from 'react-native';
import type { AuthSessionController } from '@/auth';
import {
  FormField,
  FormScreen,
  PrimaryButton,
  StatusNotice,
} from '@/components';
import type { ThemeColors } from '@/theme';
import { useProductLookup } from '../hooks/useProductLookup';

interface ManualBarcodeScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onProductFound: (product: Product) => void;
}

export function ManualBarcodeScreen({
  auth,
  colors,
  onProductFound,
}: ManualBarcodeScreenProps) {
  const lookup = useProductLookup(auth);
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  function changeCode(value: string) {
    setCode(value);
    setValidationError(null);
    lookup.clearError();
  }

  function validate() {
    setValidationError(getBarcodeError(code));
  }

  async function submit() {
    if (lookup.loading) {
      return;
    }

    const error = getBarcodeError(code);
    setValidationError(error);

    if (error) {
      return;
    }

    Keyboard.dismiss();
    const product = await lookup.lookup(code.trim());

    if (product) {
      onProductFound(product);
    }
  }

  return (
    <FormScreen>
      <View>
        <FormField
          accessibilityLabel="Product barcode"
          colors={colors}
          disabled={lookup.loading}
          error={validationError}
          keyboardType="number-pad"
          label="Barcode"
          onBlur={validate}
          onChangeText={changeCode}
          onSubmitEditing={submit}
          placeholder="Enter product barcode"
          value={code}
        />
        <PrimaryButton
          colors={colors}
          disabled={lookup.loading}
          label="Find product"
          loading={lookup.loading}
          onPress={submit}
        />
        <StatusNotice
          colors={colors}
          notice={lookup.error ? { kind: 'error', text: lookup.error } : null}
        />
      </View>
    </FormScreen>
  );
}

function getBarcodeError(value: string): string | null {
  const normalized = value.trim();

  if (!normalized) {
    return 'Enter a product barcode.';
  }

  return /^\d+$/.test(normalized) ? null : 'Barcode must contain digits only.';
}
