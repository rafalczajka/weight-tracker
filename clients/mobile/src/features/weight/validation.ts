export const MAX_WEIGHT_KG = 500;

const WEIGHT_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

export function parseWeightKg(input: string): number | null {
  const normalized = input.trim().replace(',', '.');

  if (!WEIGHT_PATTERN.test(normalized)) {
    return null;
  }

  const weightKg = Number(normalized);
  return weightKg > 0 && weightKg <= MAX_WEIGHT_KG ? weightKg : null;
}

export function getWeightError(input: string): string | null {
  if (!input.trim()) {
    return 'Enter your weight.';
  }

  return parseWeightKg(input) === null
    ? `Enter a weight between 0 and ${MAX_WEIGHT_KG} kg.`
    : null;
}
