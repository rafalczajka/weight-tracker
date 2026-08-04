import { parseWeightKg } from '@weight-tracker/client-core';

export { parseWeightKg };

export function getWeightError(input: string): string | null {
  if (!input.trim()) {
    return 'Enter your weight.';
  }

  return parseWeightKg(input) === null
    ? 'Enter a weight within the supported range.'
    : null;
}
