import {
  isCalorieDescriptionValid,
  parseCaloriesKcal,
} from '@weight-tracker/client-core';

export { parseCaloriesKcal };

export function getCaloriesError(value: string): string | null {
  if (!value.trim()) {
    return 'Enter calories.';
  }

  return parseCaloriesKcal(value) === null
    ? 'Calories must be a positive whole number.'
    : null;
}

export function getDescriptionError(value: string): string | null {
  return isCalorieDescriptionValid(value) ? null : 'Description is too long.';
}
