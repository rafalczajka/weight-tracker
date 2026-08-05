import type { Product } from '@weight-tracker/api-client';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import { Screen, ScreenState } from '@/components';
import type { ThemeColors } from '@/theme';
import { ProductCalorieForm } from '../components/ProductCalorieForm';
import { useProductCalorieForm } from '../hooks/useProductCalorieForm';

interface AddProductCaloriesScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddManually: () => void;
  onCreated: (date: string) => void;
  product: Product;
}

export function AddProductCaloriesScreen({
  auth,
  colors,
  onAddManually,
  onCreated,
  product,
}: AddProductCaloriesScreenProps) {
  const form = useProductCalorieForm({ auth, onCreated, product });

  if (!form.source || !form.mode) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Add calories manually"
          colors={colors}
          kind="unavailable"
          onAction={onAddManually}
          title="Product calories are unavailable"
        />
      </Screen>
    );
  }

  return (
    <ProductCalorieForm
      authBusy={form.authBusy}
      caloriesKcal={form.caloriesKcal}
      colors={colors}
      date={form.date}
      description={form.description}
      descriptionError={form.descriptionError}
      mode={form.mode}
      notice={form.notice}
      onDateChange={form.setDate}
      onDescriptionBlur={form.validateDescription}
      onDescriptionChange={form.changeDescription}
      onModeChange={form.changeMode}
      onQuantityBlur={form.validateQuantity}
      onQuantityChange={form.changeQuantity}
      onSubmit={form.submit}
      productName={product.name ?? 'Unknown product'}
      quantity={form.quantity}
      quantityError={form.quantityError}
      source={form.source}
      sourceCount={form.sources.length}
      submitting={form.submitting}
    />
  );
}
