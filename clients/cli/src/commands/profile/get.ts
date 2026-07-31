import { Command } from 'commander';
import { printUserProfile } from '../../presentation/profile';
import type { CliServices } from '../../services';
import { runWithAccessToken } from '../helpers';
import { getProfile } from './requests';

export function createProfileGetCommand(services: CliServices): Command {
  return new Command('get')
    .description('Show the current user profile')
    .action(() => showProfile(services));
}

async function showProfile(services: CliServices): Promise<void> {
  const profile = await runWithAccessToken(
    services,
    'Loading profile...',
    accessToken => getProfile(services.api, accessToken),
  );

  printUserProfile(services.output, profile);
}
