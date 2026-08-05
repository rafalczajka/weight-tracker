import React from 'react';
import {
  FormField,
  FormScreen,
  PrimaryButton,
  StatusNotice,
} from '@/components';
import type { ThemeColors } from '@/theme';

interface ManualBarcodeFormProps {
  code: string;
  colors: ThemeColors;
  error: string | null;
  loading: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
  validationError: string | null;
}

export function ManualBarcodeForm({
  code,
  colors,
  error,
  loading,
  onBlur,
  onChange,
  onSubmit,
  validationError,
}: ManualBarcodeFormProps) {
  return (
    <FormScreen>
      <FormField
        accessibilityLabel="Product barcode"
        colors={colors}
        disabled={loading}
        error={validationError}
        keyboardType="number-pad"
        label="Barcode"
        onBlur={onBlur}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder="Enter product barcode"
        value={code}
      />
      <PrimaryButton
        colors={colors}
        disabled={loading}
        label="Find product"
        loading={loading}
        onPress={onSubmit}
      />
      <StatusNotice
        colors={colors}
        notice={error ? { kind: 'error', text: error } : null}
      />
    </FormScreen>
  );
}
