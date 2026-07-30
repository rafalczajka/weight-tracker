import { deleteWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { DATE_FORMAT_LABEL } from '../../constants';
import type { CliServices } from '../../services';
import { parseDate } from '../../validation';
import { runWithAccessToken } from '../helpers';

export function createWeightRemoveCommand(services: CliServices): Command {
  return new Command('remove')
    .alias('rm')
    .description('Remove a weight entry')
    .argument('<date>', `Date in ${DATE_FORMAT_LABEL} format`, parseDate)
    .action((date: string) => removeWeight(services, date));
}

async function removeWeight(
  services: CliServices,
  date: string,
): Promise<void> {
  const confirmed = await services.output.confirm(
    `Are you sure you want to remove weight for ${date}?`,
  );

  if (!confirmed) {
    services.output.print('Operation cancelled.');
    return;
  }

  await runWithAccessToken(services, 'Removing weight...', accessToken =>
    deleteWeightEntry({
      ...withBearerToken(services.api, accessToken),
      path: { date },
    }),
  );

  services.output.print();
  services.output.print('Weight removed.');
  services.output.print();
}
