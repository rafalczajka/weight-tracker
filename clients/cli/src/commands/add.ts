import { createWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '../constants';
import type { CliServices } from '../services';
import { parseDate, parseWeightKg } from '../validation';
import { printMessage, runWithAccessToken } from './helpers';

interface AddOptions extends OptionValues {
  date?: string;
}

export function createAddCommand(services: CliServices): Command {
  return new Command('add')
    .aliases(['new', 'insert'])
    .description('aliases: new, insert')
    .argument('<weight>', 'Weight in kg', parseWeightKg)
    .option(
      '-d, --date <date>',
      `Date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .action(async (weightKg: number, options: AddOptions) => {
      await runWithAccessToken(services, 'Adding data...', accessToken =>
        createWeightEntry({
          ...withBearerToken(services.api, accessToken),
          body: {
            weightKg,
            ...(options.date ? { date: options.date } : {}),
          },
        }),
      );

      printMessage(services, 'Data added successfully.');
    });
}
