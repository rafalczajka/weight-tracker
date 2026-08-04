import {
  createCalorieEntry,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '@/constants';
import { parseCaloriesKcal, parseDate } from '@/parsers';
import { printCalorieEntry } from '@/presentation/calories';
import type { CliServices } from '@/services';
import { runWithAccessToken } from '@/commands/helpers';
import { parseDescription } from './validation';

interface AddOptions extends OptionValues {
  date?: string;
  description?: string;
}

export function createCalorieAddCommand(services: CliServices): Command {
  return new Command('add')
    .description('Add a calorie entry')
    .argument('<calories>', 'Calories in kcal', parseCaloriesKcal)
    .option(
      '-d, --date <date>',
      `Date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .option(
      '--description <text>',
      'Optional description (max 200 characters)',
      parseDescription,
    )
    .action((caloriesKcal: number, options: AddOptions) =>
      addCalorieEntry(services, caloriesKcal, options),
    );
}

async function addCalorieEntry(
  services: CliServices,
  caloriesKcal: number,
  options: AddOptions,
): Promise<void> {
  const entry = await runWithAccessToken(
    services,
    'Adding calorie entry...',
    async accessToken => {
      const response = await createCalorieEntry({
        ...withBearerToken(services.api, accessToken),
        body: {
          caloriesKcal,
          ...(options.date ? { date: options.date } : {}),
          ...(options.description !== undefined
            ? { description: options.description || null }
            : {}),
        },
      });

      return response.data;
    },
  );

  printCalorieEntry(services.output, entry, 'Calorie entry added.');
}
