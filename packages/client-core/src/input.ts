import {
  zCalculateCaloriesBody,
  zUpdateCalorieEntryBody,
  zUpdateUserProfileBody,
  zUpdateWeightEntryBody,
} from '@weight-tracker/api-client/schemas';

const DECIMAL_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const INTEGER_PATTERN = /^\d+$/;

export function parseWeightKg(input: string): number | null {
  const value = parseDecimal(input);

  return value !== null &&
    zUpdateWeightEntryBody.shape.weightKg.safeParse(value).success
    ? value
    : null;
}

export function parseHeightCm(input: string): number | null {
  const value = parseDecimal(input);

  return value !== null &&
    zUpdateUserProfileBody.shape.heightCm.safeParse(value).success
    ? value
    : null;
}

export function parseAgeYears(input: string): number | null {
  const value = parseInteger(input);

  return value !== null &&
    zCalculateCaloriesBody.shape.ageYears.safeParse(value).success
    ? value
    : null;
}

export function parseCaloriesKcal(input: string): number | null {
  const value = parseInteger(input);

  return value !== null &&
    zUpdateCalorieEntryBody.shape.caloriesKcal.safeParse(value).success
    ? value
    : null;
}

export function isCalorieDescriptionValid(input: string): boolean {
  return zUpdateCalorieEntryBody.shape.description.safeParse(input).success;
}

export function normalizeDescription(input: string): string | null {
  return input.trim() || null;
}

function parseDecimal(input: string): number | null {
  const normalized = input.trim().replace(',', '.');

  if (!DECIMAL_PATTERN.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function parseInteger(input: string): number | null {
  const normalized = input.trim();

  if (!INTEGER_PATTERN.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  return Number.isSafeInteger(value) ? value : null;
}
