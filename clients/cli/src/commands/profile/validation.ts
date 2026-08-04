import { CliUsageError } from '@/errors';

const PROFILE_FIELDS = [
  'height',
  'sex',
  'date-of-birth',
  'activity',
  'protein-goal',
] as const;

export type ProfileField = (typeof PROFILE_FIELDS)[number];

export function parseProfileFields(values: string[]): ProfileField[] {
  const fields = values.map(value => {
    if (!isProfileField(value)) {
      throw new CliUsageError(
        `Profile field must be one of: ${PROFILE_FIELDS.join(', ')}.`,
      );
    }

    return value;
  });

  return [...new Set(fields)];
}

function isProfileField(value: string): value is ProfileField {
  return PROFILE_FIELDS.some(field => field === value);
}
