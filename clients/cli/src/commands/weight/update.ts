import { updateWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { DATE_FORMAT_LABEL } from '../../constants';
import type { CliServices } from '../../services';
import { parseDate, parseWeightKg } from '../../parsers';
import { printMessage, runWithAccessToken } from '../helpers';

export function createWeightUpdateCommand(services: CliServices): Command {
  return new Command('update')
    .description('Update a weight entry')
    .argument('<date>', `Date in ${DATE_FORMAT_LABEL} format`, parseDate)
    .argument('<weight>', 'Weight in kg', parseWeightKg)
    .action((date: string, weightKg: number) =>
      updateWeight(services, date, weightKg),
    );
}

async function updateWeight(
  services: CliServices,
  date: string,
  weightKg: number,
): Promise<void> {
  await runWithAccessToken(services, 'Updating weight...', accessToken =>
    updateWeightEntry({
      ...withBearerToken(services.api, accessToken),
      body: { weightKg },
      path: { date },
    }),
  );

  printMessage(services, 'Weight updated.');
}
