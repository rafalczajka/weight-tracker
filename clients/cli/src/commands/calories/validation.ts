import { InvalidArgumentError } from 'commander';
import { MAX_CALORIE_DESCRIPTION_LENGTH } from '../../constants';

const MAX_INT32 = 2_147_483_647;

export function parseCaloriesKcal(value: string): number {
  return parsePositiveInteger(value, 'Calories');
}

export function parseLimitDays(value: string): number {
  return parsePositiveInteger(value, 'Limit days');
}

export function parseDescription(value: string): string {
  if (value.length > MAX_CALORIE_DESCRIPTION_LENGTH) {
    throw new InvalidArgumentError(
      `Description must not exceed ${MAX_CALORIE_DESCRIPTION_LENGTH} characters.`,
    );
  }

  return value.trim();
}

function parsePositiveInteger(value: string, label: string): number {
  const result = Number(value);

  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(result) ||
    result <= 0 ||
    result > MAX_INT32
  ) {
    throw new InvalidArgumentError(`${label} must be a positive integer.`);
  }

  return result;
}
