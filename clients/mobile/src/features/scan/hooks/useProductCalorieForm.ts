import {
  createCalorieEntry,
  withBearerToken,
  type Product,
} from '@weight-tracker/api-client';
import {
  formatApiDate,
  isCalorieDescriptionValid,
  normalizeDescription,
} from '@weight-tracker/client-core';
import { useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { apiClient } from '@/apiClient';
import { runAuthorized, type AuthSessionController } from '@/auth';
import type { StatusNoticeValue } from '@/components';
import { useMutationTracker } from '@/mutations';
import { getRequestErrorMessage } from '@/network';
import {
  calculateProductCalories,
  getDefaultProductCalorieMode,
  getDefaultProductQuantity,
  getProductCalorieSources,
  parseProductQuantity,
  type ProductCalorieMode,
} from '../productCalories';

interface UseProductCalorieFormOptions {
  auth: AuthSessionController;
  onCreated: (date: string) => void;
  product: Product;
}

export function useProductCalorieForm({
  auth,
  onCreated,
  product,
}: UseProductCalorieFormOptions) {
  const sources = useMemo(() => getProductCalorieSources(product), [product]);
  const [mode, setMode] = useState<ProductCalorieMode | null>(() =>
    getDefaultProductCalorieMode(sources),
  );
  const source = sources.find(item => item.mode === mode) ?? null;
  const [quantity, setQuantity] = useState(() =>
    source ? getDefaultProductQuantity(source) : '',
  );
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [description, setDescription] = useState(product.name ?? '');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [date, setDate] = useState(() => formatApiDate(new Date()));
  const [notice, setNotice] = useState<StatusNoticeValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { runMutation } = useMutationTracker();

  const parsedQuantity = parseProductQuantity(quantity);
  const caloriesKcal =
    source && parsedQuantity
      ? calculateProductCalories(source, parsedQuantity)
      : null;

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

  function changeDescription(value: string) {
    setDescription(value);
    setDescriptionError(null);
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
    } catch (requestError) {
      setNotice({
        kind: 'error',
        text: getRequestErrorMessage(
          requestError,
          'Unable to add calories. Try again.',
        ),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    authBusy: auth.busy,
    caloriesKcal,
    changeDescription,
    changeMode,
    changeQuantity,
    date,
    description,
    descriptionError,
    mode,
    notice,
    quantity,
    quantityError,
    setDate,
    source,
    sources,
    submit,
    submitting,
    validateDescription: () =>
      setDescriptionError(getDescriptionError(description)),
    validateQuantity: () =>
      setQuantityError(getQuantityError(quantity, caloriesKcal)),
  };
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
