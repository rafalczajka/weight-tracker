import type { Product } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import type { ThemeColors } from '@/theme';
import { ManualBarcodeForm } from '../components/ManualBarcodeForm';
import { useBarcodeForm } from '../hooks/useBarcodeForm';

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
  const form = useBarcodeForm({ auth, onProductFound });

  return (
    <ManualBarcodeForm
      code={form.code}
      colors={colors}
      error={form.error}
      loading={form.loading}
      onBlur={form.validate}
      onChange={form.changeCode}
      onSubmit={form.submit}
      validationError={form.validationError}
    />
  );
}
