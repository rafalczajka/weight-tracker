import { updateWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '../constants';
import type { CliServices } from '../services';
import { parseDate, parseWeight } from '../validation';
import { printMessage, runWithAccessToken } from './helpers';

interface UpdateOptions extends OptionValues {
  date: string;
}

export function createUpdateCommand(services: CliServices): Command {
  return new Command('update')
    .aliases(['edit'])
    .description('aliases: edit')
    .argument('<weight>', 'Weight value', parseWeight)
    .requiredOption(
      '-d, --date <date>',
      `Date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .action(async (weight: number, options: UpdateOptions) => {
      await runWithAccessToken(services, 'Updating data...', accessToken =>
        updateWeightEntry({
          ...withBearerToken(services.api, accessToken),
          body: { weight },
          path: { date: options.date },
        }),
      );

      printMessage(services, 'Data updated.');
    });
}
