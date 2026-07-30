import { createWeightEntry, withBearerToken } from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '../../constants';
import type { CliServices } from '../../services';
import { parseDate, parseWeightKg } from '../../validation';
import { printMessage, runWithAccessToken } from '../helpers';

interface AddOptions extends OptionValues {
  date?: string;
}

export function createWeightAddCommand(services: CliServices): Command {
  return new Command('add')
    .description('Add a weight entry')
    .argument('<weight>', 'Weight in kg', parseWeightKg)
    .option(
      '-d, --date <date>',
      `Date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .action((weightKg: number, options: AddOptions) =>
      addWeight(services, weightKg, options),
    );
}

async function addWeight(
  services: CliServices,
  weightKg: number,
  options: AddOptions,
): Promise<void> {
  await runWithAccessToken(services, 'Adding weight...', accessToken =>
    createWeightEntry({
      ...withBearerToken(services.api, accessToken),
      body: {
        weightKg,
        ...(options.date ? { date: options.date } : {}),
      },
    }),
  );

  printMessage(services, 'Weight added.');
}
