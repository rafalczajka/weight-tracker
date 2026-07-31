import type { UserPutRequest } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { printUserProfile } from '../../presentation/profile';
import type { CliServices } from '../../services';
import { runWithAccessToken } from '../helpers';
import { getProfile, putProfile, toProfileRequest } from './requests';
import { parseProfileFields, type ProfileField } from './validation';

const PROFILE_KEYS = {
  activity: 'activityLevel',
  'date-of-birth': 'dateOfBirth',
  height: 'heightCm',
  'protein-goal': 'proteinGoal',
  sex: 'sex',
} as const satisfies Record<ProfileField, keyof UserPutRequest>;

export function createProfileClearCommand(services: CliServices): Command {
  return new Command('clear')
    .description('Clear selected user profile fields')
    .argument(
      '<fields...>',
      'height, sex, date-of-birth, activity, or protein-goal',
    )
    .action((values: string[]) => clearProfile(services, values));
}

async function clearProfile(
  services: CliServices,
  values: string[],
): Promise<void> {
  const fields = parseProfileFields(values);
  const profile = await runWithAccessToken(
    services,
    'Clearing profile fields...',
    async accessToken => {
      const currentProfile = await getProfile(services.api, accessToken);
      const update = toProfileRequest(currentProfile);

      for (const field of fields) {
        update[PROFILE_KEYS[field]] = null;
      }

      return putProfile(services.api, accessToken, update);
    },
  );

  printUserProfile(services.output, profile, 'Profile updated');
}
