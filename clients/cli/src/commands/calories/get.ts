import { getDailyCalories, withBearerToken } from '@weight-tracker/api-client';
import { formatApiDate } from '@weight-tracker/client-core';
import { Command } from 'commander';
import { DATE_FORMAT_LABEL } from '@/constants';
import { printDailyCalories } from '@/presentation/calories';
import type { CliServices } from '@/services';
import { parseDate } from '@/parsers';
import { runWithAccessToken } from '@/commands/helpers';

export function createCalorieGetCommand(services: CliServices): Command {
  return new Command('get')
    .description('Get calorie entries for a day')
    .argument(
      '[date]',
      `Date in ${DATE_FORMAT_LABEL} format (default: today UTC)`,
      parseDate,
    )
    .action((date?: string) => getCaloriesForDate(services, date));
}

async function getCaloriesForDate(
  services: CliServices,
  date?: string,
): Promise<void> {
  const selectedDate = date ?? formatApiDate(services.now?.() ?? new Date());
  const day = await runWithAccessToken(
    services,
    'Fetching daily calories...',
    async accessToken => {
      const response = await getDailyCalories({
        ...withBearerToken(services.api, accessToken),
        path: { date: selectedDate },
      });

      return response.data;
    },
  );

  printDailyCalories(services.output, day);
}
