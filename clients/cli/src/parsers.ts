import type {
  ActivityLevel,
  ProteinGoal,
  Sex,
} from '@weight-tracker/api-client';
import {
  isApiDate,
  parseAgeYears as parseAgeYearsInput,
  parseCaloriesKcal as parseCaloriesKcalInput,
  parseHeightCm as parseHeightCmInput,
  parseWeightKg as parseWeightKgInput,
} from '@weight-tracker/client-core';
import { InvalidArgumentError } from 'commander';

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
  if (!isApiDate(value)) {
    throw new InvalidArgumentError('Date must be in YYYY-MM-DD format.');
  }

  return value;
}

export function parseWeightKg(value: string): number {
  const weightKg = parseWeightKgInput(value);

  if (weightKg === null) {
    throw new InvalidArgumentError(
      'Weight must be a number within the supported range.',
    );
  }

  return weightKg;
}

export function parseHeightCm(value: string): number {
  const heightCm = parseHeightCmInput(value);

  if (heightCm === null) {
    throw new InvalidArgumentError(
      'Height must be a number within the supported range.',
    );
  }

  return heightCm;
}

export function parseAgeYears(value: string): number {
  const ageYears = parseAgeYearsInput(value);

  if (ageYears === null) {
    throw new InvalidArgumentError(
      'Age must be an integer within the supported range.',
    );
  }

  return ageYears;
}

export function parseCaloriesKcal(value: string): number {
  const caloriesKcal = parseCaloriesKcalInput(value);

  if (caloriesKcal === null) {
    throw new InvalidArgumentError('Calories must be a positive integer.');
  }

  return caloriesKcal;
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
