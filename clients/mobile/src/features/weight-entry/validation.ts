export const MAX_WEIGHT_KG = 500;

const WEIGHT_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

export function parseWeight(input: string): number | null {
  const normalized = input.trim().replace(',', '.');

  if (!WEIGHT_PATTERN.test(normalized)) {
    return null;
  }

  const weight = Number(normalized);
  return weight > 0 && weight <= MAX_WEIGHT_KG ? weight : null;
}

export function getWeightError(input: string): string | null {
  if (!input.trim()) {
    return 'Enter your weight.';
  }

  return parseWeight(input) === null
    ? `Enter a weight between 0 and ${MAX_WEIGHT_KG} kg.`
    : null;
}
