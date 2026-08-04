const POSITIVE_INTEGER_PATTERN = /^\d+$/;

export function parseCaloriesKcal(value: string): number | null {
  const normalized = value.trim();

  if (!POSITIVE_INTEGER_PATTERN.test(normalized)) {
    return null;
  }

  const caloriesKcal = Number(normalized);
  return Number.isSafeInteger(caloriesKcal) && caloriesKcal > 0
    ? caloriesKcal
    : null;
}

export function getCaloriesError(value: string): string | null {
  if (!value.trim()) {
    return 'Enter calories.';
  }

  return parseCaloriesKcal(value) === null
    ? 'Calories must be a positive whole number.'
    : null;
}

export function getDescriptionError(value: string): string | null {
  return value.trim().length > 200
    ? 'Description must not exceed 200 characters.'
    : null;
}
