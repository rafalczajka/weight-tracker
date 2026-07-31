import type { ApiError } from '@weight-tracker/api-client';

const OPTION_NAMES: Readonly<Record<string, string>> = {
  activityLevel: '--activity',
  ageYears: '--age',
  dateOfBirth: '--date-of-birth',
  goal: '--goal',
  heightCm: '--height',
  proteinGoal: '--protein-goal',
  sex: '--sex',
  weightKg: '--weight',
};

export function formatApiError(error: ApiError): string {
  if (!error.validationErrors) {
    return error.message;
  }

  const details = Object.entries(error.validationErrors).flatMap(
    ([field, messages]) =>
      messages.map(message => `  ${OPTION_NAMES[field] ?? field}: ${message}`),
  );

  return details.length === 0
    ? error.message
    : [error.message, ...details].join('\n');
}
