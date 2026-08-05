import type { Product } from '@weight-tracker/api-client';

const DECIMAL_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const MAX_CALORIES_KCAL = 2_147_483_647;

export type ProductCalorieMode = 'amount' | 'serving';

export interface ProductCalorieSource {
  energyKcal: number;
  mode: ProductCalorieMode;
  referenceAmount: number;
  unit: string;
}

export function getProductCalorieSources(
  product: Product,
): ProductCalorieSource[] {
  const sources: ProductCalorieSource[] = [];
  const perServing = product.nutrition?.perServing;
  const per100 = product.nutrition?.per100;

  if (isPositive(perServing?.energyKcal)) {
    sources.push({
      energyKcal: perServing.energyKcal,
      mode: 'serving',
      referenceAmount: 1,
      unit: 'serving',
    });
  }

  if (
    isPositive(per100?.energyKcal) &&
    isPositive(per100.referenceAmount) &&
    per100.referenceUnit?.trim()
  ) {
    sources.push({
      energyKcal: per100.energyKcal,
      mode: 'amount',
      referenceAmount: per100.referenceAmount,
      unit: per100.referenceUnit.trim(),
    });
  }

  return sources;
}

export function getDefaultProductCalorieMode(
  sources: readonly ProductCalorieSource[],
): ProductCalorieMode | null {
  return (
    sources.find(source => source.mode === 'serving')?.mode ??
    sources[0]?.mode ??
    null
  );
}

export function getDefaultProductQuantity(
  source: ProductCalorieSource,
): string {
  return String(source.referenceAmount);
}

export function parseProductQuantity(input: string): number | null {
  const normalized = input.trim().replace(',', '.');

  if (!DECIMAL_PATTERN.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  return isPositive(value) ? value : null;
}

export function calculateProductCalories(
  source: ProductCalorieSource,
  quantity: number,
): number | null {
  if (!isPositive(quantity)) {
    return null;
  }

  const calories = Math.round(
    source.energyKcal * (quantity / source.referenceAmount),
  );

  return Number.isSafeInteger(calories) &&
    calories > 0 &&
    calories <= MAX_CALORIES_KCAL
    ? calories
    : null;
}

function isPositive(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
