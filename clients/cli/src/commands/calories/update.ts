import {
  updateCalorieEntry,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { printCalorieEntry } from '../../presentation/calories';
import type { CliServices } from '../../services';
import { runWithAccessToken } from '../helpers';
import { parseCaloriesKcal, parseDescription } from './validation';

interface UpdateOptions extends OptionValues {
  description?: string;
}

export function createCalorieUpdateCommand(services: CliServices): Command {
  return new Command('update')
    .description('Update a calorie entry')
    .argument('<id>', 'Calorie entry ID')
    .argument('<calories>', 'Calories in kcal', parseCaloriesKcal)
    .option(
      '--description <text>',
      'Replacement description; omit to clear it',
      parseDescription,
    )
    .action((id: string, caloriesKcal: number, options: UpdateOptions) =>
      updateCalories(services, id, caloriesKcal, options),
    );
}

async function updateCalories(
  services: CliServices,
  id: string,
  caloriesKcal: number,
  options: UpdateOptions,
): Promise<void> {
  const entry = await runWithAccessToken(
    services,
    'Updating calorie entry...',
    async accessToken => {
      const response = await updateCalorieEntry({
        ...withBearerToken(services.api, accessToken),
        body: {
          caloriesKcal,
          description: options.description || null,
        },
        path: { id },
      });

      return response.data;
    },
  );

  printCalorieEntry(services.output, entry, 'Calorie entry updated.');
}
