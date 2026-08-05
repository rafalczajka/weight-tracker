import type { Product } from '@weight-tracker/api-client';
import {
  calculateProductCalories,
  getDefaultProductCalorieMode,
  getProductCalorieSources,
  parseProductQuantity,
} from '../src/features/scan/productCalories';

const product: Product = {
  code: '12345678',
  nutrition: {
    per100: {
      energyKcal: 240,
      referenceAmount: 100,
      referenceUnit: 'g',
    },
    perServing: {
      energyKcal: 120,
      referenceAmount: 50,
      referenceUnit: 'g',
    },
  },
};

describe('product calorie calculation', () => {
  test('prefers serving mode when serving and amount data are available', () => {
    const sources = getProductCalorieSources(product);

    expect(sources.map(source => source.mode)).toEqual(['serving', 'amount']);
    expect(getDefaultProductCalorieMode(sources)).toBe('serving');
  });

  test('uses amount mode when serving calories are unavailable', () => {
    const sources = getProductCalorieSources({
      ...product,
      nutrition: { per100: product.nutrition?.per100 },
    });

    expect(getDefaultProductCalorieMode(sources)).toBe('amount');
  });

  test('does not expose amount mode without a reference unit', () => {
    const sources = getProductCalorieSources({
      code: product.code,
      nutrition: {
        per100: {
          energyKcal: 240,
          referenceAmount: 100,
        },
      },
    });

    expect(sources).toEqual([]);
  });

  test.each([
    ['1.5', 1.5],
    ['1,5', 1.5],
    ['.5', 0.5],
  ])('parses positive decimal quantity %s', (input, expected) => {
    expect(parseProductQuantity(input)).toBe(expected);
  });

  test.each(['', '0', '-1', 'value'])('rejects invalid quantity %s', input => {
    expect(parseProductQuantity(input)).toBeNull();
  });

  test('calculates calories from servings', () => {
    const source = getProductCalorieSources(product)[0];

    expect(calculateProductCalories(source, 2.5)).toBe(300);
  });

  test('calculates calories proportionally from an amount', () => {
    const source = getProductCalorieSources(product)[1];

    expect(calculateProductCalories(source, 75)).toBe(180);
  });

  test('rounds calories and rejects a result below one kilocalorie', () => {
    const source = getProductCalorieSources(product)[1];

    expect(calculateProductCalories(source, 33.3)).toBe(80);
    expect(calculateProductCalories(source, 0.01)).toBeNull();
  });

  test('rejects a calorie total outside the API integer range', () => {
    const source = getProductCalorieSources(product)[0];

    expect(
      calculateProductCalories(source, Number.MAX_SAFE_INTEGER),
    ).toBeNull();
  });
});
