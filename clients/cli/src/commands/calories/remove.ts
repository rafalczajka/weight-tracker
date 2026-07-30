import {
  deleteCalorieEntry,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command } from 'commander';
import type { CliServices } from '../../services';
import { printMessage, runWithAccessToken } from '../helpers';

export function createCalorieRemoveCommand(services: CliServices): Command {
  return new Command('remove')
    .alias('rm')
    .description('Remove a calorie entry')
    .argument('<id>', 'Calorie entry ID')
    .action((id: string) => removeCalorieEntry(services, id));
}

async function removeCalorieEntry(
  services: CliServices,
  id: string,
): Promise<void> {
  const confirmed = await services.output.confirm(
    `Are you sure you want to remove calorie entry ${id}?`,
  );

  if (!confirmed) {
    services.output.print('Operation cancelled.');
    return;
  }

  await runWithAccessToken(services, 'Removing calorie entry...', accessToken =>
    deleteCalorieEntry({
      ...withBearerToken(services.api, accessToken),
      path: { id },
    }),
  );

  printMessage(services, 'Calorie entry removed.');
}
