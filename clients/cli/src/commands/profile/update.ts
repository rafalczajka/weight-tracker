import type {
  ActivityLevel,
  ProteinGoal,
  Sex,
  UserPutRequest,
  UserResponse,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '../../constants';
import { CliUsageError } from '../../errors';
import { printUserProfile } from '../../presentation/profile';
import type { CliServices } from '../../services';
import {
  parseActivityLevel,
  parseDate,
  parseHeightCm,
  parseProteinGoal,
  parseSex,
} from '../../parsers';
import { runWithAccessToken } from '../helpers';
import { getProfile, putProfile } from './requests';

interface ProfileUpdateOptions extends OptionValues {
  activity?: ActivityLevel;
  dateOfBirth?: string;
  height?: number;
  proteinGoal?: ProteinGoal;
  sex?: Sex;
}

export function createProfileUpdateCommand(services: CliServices): Command {
  return new Command('update')
    .description('Update selected user profile fields')
    .option('--height <cm>', 'Height in cm', parseHeightCm)
    .option('--sex <value>', 'female or male', parseSex)
    .option(
      '--date-of-birth <date>',
      `Date of birth in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .option(
      '--activity <level>',
      'sedentary, lightly-active, moderately-active, very-active, or extra-active',
      parseActivityLevel,
    )
    .option(
      '--protein-goal <goal>',
      'general-health or muscle-gain',
      parseProteinGoal,
    )
    .action((options: ProfileUpdateOptions) =>
      updateProfile(services, options),
    );
}

async function updateProfile(
  services: CliServices,
  options: ProfileUpdateOptions,
): Promise<void> {
  if (!hasUpdates(options)) {
    throw new CliUsageError('Specify at least one profile field to update.');
  }

  const profile = await runWithAccessToken(
    services,
    'Updating profile...',
    async accessToken => {
      const currentProfile = await getProfile(services.api, accessToken);
      const update = mergeProfile(currentProfile, options);
      return putProfile(services.api, accessToken, update);
    },
  );

  printUserProfile(services.output, profile, 'Profile updated');
}

function hasUpdates(options: ProfileUpdateOptions): boolean {
  return (
    options.activity !== undefined ||
    options.dateOfBirth !== undefined ||
    options.height !== undefined ||
    options.proteinGoal !== undefined ||
    options.sex !== undefined
  );
}

function mergeProfile(
  currentProfile: UserResponse,
  options: ProfileUpdateOptions,
): UserPutRequest {
  return {
    activityLevel: options.activity ?? currentProfile.activityLevel ?? null,
    dateOfBirth: options.dateOfBirth ?? currentProfile.dateOfBirth ?? null,
    heightCm: options.height ?? currentProfile.heightCm ?? null,
    proteinGoal: options.proteinGoal ?? currentProfile.proteinGoal ?? null,
    sex: options.sex ?? currentProfile.sex ?? null,
  };
}
