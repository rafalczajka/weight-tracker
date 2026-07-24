import { updateWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '../constants';
import type { CliServices } from '../services';
import { parseDate, parseWeightKg } from '../validation';
import { printMessage, runWithAccessToken } from './helpers';

interface UpdateOptions extends OptionValues {
  date: string;
}

export function createUpdateCommand(services: CliServices): Command {
  return new Command('update')
    .aliases(['edit'])
    .description('aliases: edit')
    .argument('<weight>', 'Weight in kg', parseWeightKg)
    .requiredOption(
      '-d, --date <date>',
      `Date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .action(async (weightKg: number, options: UpdateOptions) => {
      await runWithAccessToken(services, 'Updating data...', accessToken =>
        updateWeightEntry({
          ...withBearerToken(services.api, accessToken),
          body: { weightKg },
          path: { date: options.date },
        }),
      );

      printMessage(services, 'Data updated.');
    });
}
