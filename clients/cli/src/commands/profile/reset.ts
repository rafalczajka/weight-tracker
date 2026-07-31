import type { UserPutRequest } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { printUserProfile } from '../../presentation/profile';
import type { CliServices } from '../../services';
import { runWithAccessToken } from '../helpers';
import { putProfile } from './requests';

const EMPTY_PROFILE: UserPutRequest = {
  activityLevel: null,
  dateOfBirth: null,
  heightCm: null,
  proteinGoal: null,
  sex: null,
};

export function createProfileResetCommand(services: CliServices): Command {
  return new Command('reset')
    .description('Clear the entire user profile')
    .action(() => resetProfile(services));
}

async function resetProfile(services: CliServices): Promise<void> {
  const confirmed = await services.output.confirm(
    'Are you sure you want to clear the entire user profile?',
  );

  if (!confirmed) {
    services.output.print('Operation cancelled.');
    return;
  }

  const profile = await runWithAccessToken(
    services,
    'Resetting profile...',
    accessToken => putProfile(services.api, accessToken, EMPTY_PROFILE),
  );

  printUserProfile(services.output, profile, 'Profile reset');
}
