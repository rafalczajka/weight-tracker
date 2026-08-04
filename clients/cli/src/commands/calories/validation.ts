import { InvalidArgumentError } from 'commander';
import { MAX_CALORIE_DESCRIPTION_LENGTH } from '@/constants';

export function parseDescription(value: string): string {
  if (value.length > MAX_CALORIE_DESCRIPTION_LENGTH) {
    throw new InvalidArgumentError(
      `Description must not exceed ${MAX_CALORIE_DESCRIPTION_LENGTH} characters.`,
    );
  }

  return value.trim();
}
