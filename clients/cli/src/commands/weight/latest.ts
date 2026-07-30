import {
  getLatestWeightEntry,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command } from 'commander';
import { printWeightEntry } from '../../presentation/weight';
import type { CliServices } from '../../services';
import { runWithAccessToken } from '../helpers';

export function createWeightLatestCommand(services: CliServices): Command {
  return new Command('latest')
    .description('Get the latest weight entry')
    .action(() => getLatestWeight(services));
}

async function getLatestWeight(services: CliServices): Promise<void> {
  const entry = await runWithAccessToken(
    services,
    'Fetching latest weight...',
    async accessToken => {
      const response = await getLatestWeightEntry({
        ...withBearerToken(services.api, accessToken),
      });

      return response.data;
    },
  );

  printWeightEntry(services.output, entry);
}
