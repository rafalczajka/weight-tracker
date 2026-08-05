import type {
  ActivityLevel,
  ProteinGoal,
  Sex,
  UserPutRequest,
  UserResponse,
} from '@weight-tracker/api-client';
import {
  formatApiDate,
  isApiDate,
  parseHeightCm,
} from '@weight-tracker/client-core';

export const SEX_VALUES = ['female', 'male'] as const satisfies readonly Sex[];

export const ACTIVITY_LEVEL_VALUES = [
  'sedentary',
  'lightlyActive',
  'moderatelyActive',
  'veryActive',
  'extraActive',
] as const satisfies readonly ActivityLevel[];

export const PROTEIN_GOAL_VALUES = [
  'generalHealth',
  'muscleGain',
] as const satisfies readonly ProteinGoal[];

export interface ProfileFormValues {
  activityLevel: ActivityLevel | null;
  dateOfBirth?: string;
  heightCm: string;
  proteinGoal: ProteinGoal | null;
  sex: Sex | null;
}

export interface ProfileFormErrors {
  dateOfBirth: string | null;
  heightCm: string | null;
}

export function createProfileFormValues(
  profile: UserResponse,
): ProfileFormValues {
  return {
    activityLevel: profile.activityLevel ?? null,
    dateOfBirth: profile.dateOfBirth ?? undefined,
    heightCm: profile.heightCm == null ? '' : String(profile.heightCm),
    proteinGoal: profile.proteinGoal ?? null,
    sex: profile.sex ?? null,
  };
}

export function createEmptyProfileRequest(): UserPutRequest {
  return {
    activityLevel: null,
    dateOfBirth: null,
    heightCm: null,
    proteinGoal: null,
    sex: null,
  };
}

export function createProfileRequest(
  values: ProfileFormValues,
): UserPutRequest {
  return {
    activityLevel: values.activityLevel,
    dateOfBirth: values.dateOfBirth ?? null,
    heightCm: values.heightCm.trim() ? parseHeightCm(values.heightCm) : null,
    proteinGoal: values.proteinGoal,
    sex: values.sex,
  };
}

export function getProfileFormErrors(
  values: ProfileFormValues,
  today = new Date(),
): ProfileFormErrors {
  return {
    dateOfBirth: getDateOfBirthError(values.dateOfBirth, today),
    heightCm: getHeightError(values.heightCm),
  };
}

export function hasProfileFormErrors(errors: ProfileFormErrors): boolean {
  return Boolean(errors.dateOfBirth || errors.heightCm);
}

export function areProfileValuesEqual(
  first: ProfileFormValues,
  second: ProfileFormValues,
): boolean {
  return (
    first.activityLevel === second.activityLevel &&
    first.dateOfBirth === second.dateOfBirth &&
    first.heightCm === second.heightCm &&
    first.proteinGoal === second.proteinGoal &&
    first.sex === second.sex
  );
}

export function getAdultBirthDateBounds(today = new Date()): {
  maximumDate: Date;
  minimumDate: Date;
} {
  const currentDate = toUtcDateParts(today);
  const maximumDate = createAgeBoundary(currentDate, 18);
  const minimumBoundary = createAgeBoundary(currentDate, 121);
  minimumBoundary.setDate(minimumBoundary.getDate() + 1);

  return { maximumDate, minimumDate: minimumBoundary };
}

function getHeightError(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  return parseHeightCm(value) === null
    ? 'Height must be a number between 0 and 300 cm.'
    : null;
}

function getDateOfBirthError(value: string | undefined, today: Date) {
  if (!value) {
    return null;
  }

  if (!isApiDate(value)) {
    return 'Date of birth is invalid.';
  }

  const age = calculateAge(value, formatApiDate(today));
  return age >= 18 && age <= 120
    ? null
    : 'Age must be between 18 and 120 years.';
}

function calculateAge(dateOfBirth: string, currentDate: string): number {
  const birth = parseDateParts(dateOfBirth);
  const current = parseDateParts(currentDate);
  let age = current.year - birth.year;
  const anniversaryDay = Math.min(
    birth.day,
    daysInMonth(current.year, birth.month),
  );

  if (
    current.month < birth.month ||
    (current.month === birth.month && current.day < anniversaryDay)
  ) {
    age--;
  }

  return age;
}

function parseDateParts(value: string) {
  return {
    day: Number(value.slice(8, 10)),
    month: Number(value.slice(5, 7)),
    year: Number(value.slice(0, 4)),
  };
}

function toUtcDateParts(date: Date) {
  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
}

function createLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, Math.min(day, daysInMonth(year, month)), 12);
}

function createAgeBoundary(
  currentDate: ReturnType<typeof toUtcDateParts>,
  years: number,
): Date {
  const targetYear = currentDate.year - years;
  const currentMonthEnd = daysInMonth(currentDate.year, currentDate.month);
  const targetMonthEnd = daysInMonth(targetYear, currentDate.month);
  const targetDay =
    currentDate.day === currentMonthEnd
      ? targetMonthEnd
      : Math.min(currentDate.day, targetMonthEnd);

  return createLocalDate(targetYear, currentDate.month, targetDay);
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
