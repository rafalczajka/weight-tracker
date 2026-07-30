import type {
  ActivityLevel,
  ProteinGoal,
  Sex,
} from '@weight-tracker/api-client';
import { InvalidArgumentError } from 'commander';

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
  const ageYears = Number(value);

  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(ageYears) ||
    ageYears < 18 ||
    ageYears > 120
  ) {
    throw new InvalidArgumentError(
      'Age must be an integer between 18 and 120.',
    );
  }

  return ageYears;
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
