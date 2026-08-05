import {
  createCalorieEntry,
  withBearerToken,
  type Product,
} from '@weight-tracker/api-client';
import {
  isCalorieDescriptionValid,
  normalizeDescription,
} from '@weight-tracker/client-core';
import React, { useMemo, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import {
  DateField,
  FormField,
  FormScreen,
  PrimaryButton,
  Screen,
  ScreenState,
  StatusNotice,
  type StatusNoticeValue,
} from '@/components';
import { formatApiDate } from '@weight-tracker/client-core';
import { formatCaloriesKcal } from '@/format';
import { useMutationTracker } from '@/mutations';
import type { ThemeColors } from '@/theme';
import { ProductCalorieModeSelector } from '../components/ProductCalorieModeSelector';
import {
  calculateProductCalories,
  getDefaultProductCalorieMode,
  getDefaultProductQuantity,
  getProductCalorieSources,
  parseProductQuantity,
  type ProductCalorieMode,
} from '../productCalories';

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
  const sources = useMemo(() => getProductCalorieSources(product), [product]);
  const defaultMode = getDefaultProductCalorieMode(sources);
  const [mode, setMode] = useState<ProductCalorieMode | null>(defaultMode);
  const source = sources.find(item => item.mode === mode) ?? null;
  const [quantity, setQuantity] = useState(
    source ? getDefaultProductQuantity(source) : '',
  );
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [description, setDescription] = useState(product.name ?? '');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [date, setDate] = useState(formatApiDate(new Date()));
  const [notice, setNotice] = useState<StatusNoticeValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { runMutation } = useMutationTracker();

  const parsedQuantity = parseProductQuantity(quantity);
  const caloriesKcal =
    source && parsedQuantity
      ? calculateProductCalories(source, parsedQuantity)
      : null;

  if (!source) {
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

  function changeMode(nextMode: ProductCalorieMode) {
    const nextSource = sources.find(item => item.mode === nextMode);

    if (!nextSource) {
      return;
    }

    setMode(nextMode);
    setQuantity(getDefaultProductQuantity(nextSource));
    setQuantityError(null);
    setNotice(null);
  }

  function changeQuantity(value: string) {
    setQuantity(value);
    setQuantityError(null);
    setNotice(null);
  }

  function validateQuantity() {
    setQuantityError(getQuantityError(quantity, caloriesKcal));
  }

  function changeDescription(value: string) {
    setDescription(value);
    setDescriptionError(null);
  }

  function validateDescription() {
    setDescriptionError(getDescriptionError(description));
  }

  async function submit() {
    if (submitting) {
      return;
    }

    const nextQuantityError = getQuantityError(quantity, caloriesKcal);
    const nextDescriptionError = getDescriptionError(description);
    setQuantityError(nextQuantityError);
    setDescriptionError(nextDescriptionError);

    if (nextQuantityError || nextDescriptionError || !caloriesKcal) {
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    setNotice(null);

    try {
      const entry = await runMutation(() =>
        runAuthorized(auth, async accessToken => {
          const response = await createCalorieEntry({
            ...withBearerToken(apiClient, accessToken),
            body: {
              caloriesKcal,
              date,
              description: normalizeDescription(description),
            },
          });

          return response.data;
        }),
      );

      if (entry) {
        onCreated(entry.date);
      }
    } catch {
      setNotice({
        kind: 'error',
        text: 'Unable to add calories. Try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormScreen>
      <Text style={[styles.productName, { color: colors.text }]}>
        {product.name ?? 'Unknown product'}
      </Text>

      {sources.length > 1 && mode ? (
        <ProductCalorieModeSelector
          colors={colors}
          mode={mode}
          onChange={changeMode}
        />
      ) : null}

      <FormField
        accessibilityLabel={
          mode === 'serving' ? 'Number of servings' : `Amount in ${source.unit}`
        }
        colors={colors}
        disabled={submitting}
        error={quantityError}
        keyboardType="decimal-pad"
        label={mode === 'serving' ? 'Servings' : 'Amount'}
        onBlur={validateQuantity}
        onChangeText={changeQuantity}
        onSubmitEditing={submit}
        placeholder="0"
        suffix={mode === 'serving' ? 'servings' : source.unit}
        value={quantity}
      />

      <View
        accessibilityLabel={
          caloriesKcal ? `${caloriesKcal} kilocalories` : 'Calories unavailable'
        }
        style={[styles.total, { borderColor: colors.border }]}
      >
        <Text style={[styles.totalLabel, { color: colors.muted }]}>
          Calories
        </Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          {caloriesKcal ? formatCaloriesKcal(caloriesKcal) : 'Not available'}
        </Text>
      </View>

      <FormField
        accessibilityLabel="Calorie entry description"
        colors={colors}
        disabled={submitting}
        error={descriptionError}
        label="Description (optional)"
        maxLength={200}
        onBlur={validateDescription}
        onChangeText={changeDescription}
        placeholder="Product name"
        value={description}
      />

      <DateField
        colors={colors}
        disabled={submitting}
        label="Date"
        onChange={setDate}
        value={date}
      />

      <PrimaryButton
        colors={colors}
        disabled={submitting || auth.busy || !caloriesKcal}
        label="Add calories"
        loading={submitting}
        onPress={submit}
      />
      <StatusNotice colors={colors} notice={notice} />
    </FormScreen>
  );
}

function getQuantityError(
  quantity: string,
  caloriesKcal: number | null,
): string | null {
  if (!quantity.trim()) {
    return 'Enter a quantity.';
  }

  if (parseProductQuantity(quantity) === null) {
    return 'Quantity must be a positive number.';
  }

  return caloriesKcal === null
    ? 'Quantity produces an invalid calorie total.'
    : null;
}

function getDescriptionError(value: string): string | null {
  return isCalorieDescriptionValid(value) ? null : 'Description is too long.';
}

const styles = StyleSheet.create({
  productName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 26,
    marginBottom: 24,
    textAlign: 'center',
  },
  total: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginBottom: 24,
    paddingVertical: 16,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 6,
  },
});
