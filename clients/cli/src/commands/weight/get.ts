import { getWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { DATE_FORMAT_LABEL } from '../../constants';
import { printWeightEntry } from '../../presentation/weight';
import type { CliServices } from '../../services';
import { parseDate } from '../../validation';
import { runWithAccessToken } from '../helpers';

export function createWeightGetCommand(services: CliServices): Command {
  return new Command('get')
    .description('Get a weight entry')
    .argument('<date>', `Date in ${DATE_FORMAT_LABEL} format`, parseDate)
    .action((date: string) => getWeight(services, date));
}

async function getWeight(services: CliServices, date: string): Promise<void> {
  const entry = await runWithAccessToken(
    services,
    'Fetching weight...',
    async accessToken => {
      const response = await getWeightEntry({
        ...withBearerToken(services.api, accessToken),
        path: { date },
      });

      return response.data;
    },
  );

  printWeightEntry(services.output, entry);
}
