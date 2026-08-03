import type {
  ActivityLevel,
  ProteinGoal,
  Sex,
} from '@weight-tracker/api-client';
import { InvalidArgumentError } from 'commander';
import { MAX_WEIGHT_KG } from './constants';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_INT32 = 2_147_483_647;

const ACTIVITY_LEVELS = {
  sedentary: 'sedentary',
  'lightly-active': 'lightlyActive',
  'moderately-active': 'moderatelyActive',
  'very-active': 'veryActive',
  'extra-active': 'extraActive',
} as const satisfies Record<string, ActivityLevel>;

const PROTEIN_GOALS = {
  'general-health': 'generalHealth',
  'muscle-gain': 'muscleGain',
} as const satisfies Record<string, ProteinGoal>;

const SEXES = {
  female: 'female',
  male: 'male',
} as const satisfies Record<string, Sex>;

export function parseDate(value: string): string {
  const match = DATE_PATTERN.exec(value);

  if (!match) {
    throw new InvalidArgumentError('Date must be in YYYY-MM-DD format.');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    year === 0 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new InvalidArgumentError('Date must be in YYYY-MM-DD format.');
  }

  return value;
}

export function parseWeightKg(value: string): number {
  const weightKg = Number(value);

  if (
    !value.trim() ||
    !Number.isFinite(weightKg) ||
    weightKg <= 0 ||
    weightKg > MAX_WEIGHT_KG
  ) {
    throw new InvalidArgumentError(
      `Weight must be a number greater than 0 and at most ${MAX_WEIGHT_KG} kg.`,
    );
  }

  return weightKg;
}

export function parseHeightCm(value: string): number {
  const heightCm = Number(value);

  if (
    !value.trim() ||
    !Number.isFinite(heightCm) ||
    heightCm <= 0 ||
    heightCm > 300
  ) {
    throw new InvalidArgumentError(
      'Height must be a number greater than 0 and at most 300 cm.',
    );
  }

  return heightCm;
}

export function parseAgeYears(value: string): number {
  return parsePositiveInteger(
    value,
    'Age must be an integer between 18 and 120.',
    18,
    120,
  );
}

export function parseCaloriesKcal(value: string): number {
  return parsePositiveInteger(
    value,
    'Calories must be a positive integer.',
    1,
    MAX_INT32,
  );
}

export function parseLimitDays(value: string): number {
  return parsePositiveInteger(
    value,
    'Limit days must be a positive integer.',
    1,
    MAX_INT32,
  );
}

export function parseActivityLevel(value: string): ActivityLevel {
  const activityLevel = ACTIVITY_LEVELS[value as keyof typeof ACTIVITY_LEVELS];

  if (!activityLevel) {
    throw new InvalidArgumentError(
      `Activity must be one of: ${Object.keys(ACTIVITY_LEVELS).join(', ')}.`,
    );
  }

  return activityLevel;
}

export function parseProteinGoal(value: string): ProteinGoal {
  const goal = PROTEIN_GOALS[value as keyof typeof PROTEIN_GOALS];

  if (!goal) {
    throw new InvalidArgumentError(
      `Goal must be one of: ${Object.keys(PROTEIN_GOALS).join(', ')}.`,
    );
  }

  return goal;
}

export function parseSex(value: string): Sex {
  const sex = SEXES[value as keyof typeof SEXES];

  if (!sex) {
    throw new InvalidArgumentError(
      `Sex must be one of: ${Object.keys(SEXES).join(', ')}.`,
    );
  }

  return sex;
}

export function parseTail(value: string): number {
  const tail = Number(value);

  if (!/^-?\d+$/.test(value) || !Number.isSafeInteger(tail)) {
    throw new InvalidArgumentError('Tail must be an integer.');
  }

  return Math.max(0, tail);
}

export function parseMovingAverageDays(value: string): number {
  return parsePositiveInteger(
    value,
    'Moving average days must be a positive integer.',
  );
}

export function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parsePositiveInteger(
  value: string,
  message: string,
  minimum = 1,
  maximum = Number.MAX_SAFE_INTEGER,
): number {
  const result = Number(value);

  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(result) ||
    result < minimum ||
    result > maximum
  ) {
    throw new InvalidArgumentError(message);
  }

  return result;
}
