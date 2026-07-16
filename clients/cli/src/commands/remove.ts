import { deleteWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { DATE_FORMAT_LABEL } from '../constants';
import type { CliServices } from '../services';
import { parseDate } from '../validation';
import { runWithAccessToken } from './helpers';

export function createRemoveCommand(services: CliServices): Command {
  return new Command('remove')
    .aliases(['rm', 'delete'])
    .description('aliases: rm, delete')
    .argument('<date>', `Date in ${DATE_FORMAT_LABEL} format`, parseDate)
    .action(async (date: string) => {
      const confirmed = await services.output.confirm(
        `Are you sure you want to remove data for ${date}?`,
      );

      if (!confirmed) {
        services.output.print('Operation cancelled.');
        return;
      }

      await runWithAccessToken(services, 'Removing data...', accessToken =>
        deleteWeightEntry({
          ...withBearerToken(services.api, accessToken),
          path: { date },
        }),
      );

      services.output.print('Data removed.');
      services.output.print();
    });
}
