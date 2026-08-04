import { getCalories, withBearerToken } from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '@/constants';
import { CliUsageError } from '@/errors';
import { parseDate, parseLimitDays } from '@/parsers';
import { printCalorieList } from '@/presentation/calories';
import type { CliServices } from '@/services';
import { runWithAccessToken } from '@/commands/helpers';

interface ListOptions extends OptionValues {
  from?: string;
  limitDays?: number;
  to?: string;
}

export function createCalorieListCommand(services: CliServices): Command {
  return new Command('list')
    .alias('ls')
    .description('List daily calorie totals')
    .option(
      '--from <date>',
      `Start date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .option('--to <date>', `End date in ${DATE_FORMAT_LABEL} format`, parseDate)
    .option(
      '--limit-days <count>',
      'Return only the newest N complete days',
      parseLimitDays,
    )
    .action((options: ListOptions) => listCalories(services, options));
}

async function listCalories(
  services: CliServices,
  options: ListOptions,
): Promise<void> {
  validateDateRange(options);

  const result = await runWithAccessToken(
    services,
    'Fetching calories...',
    async accessToken => {
      const response = await getCalories({
        ...withBearerToken(services.api, accessToken),
        query: {
          ...(options.from ? { from: options.from } : {}),
          ...(options.to ? { to: options.to } : {}),
          ...(options.limitDays !== undefined
            ? { limitDays: options.limitDays }
            : {}),
        },
      });

      return response.data;
    },
  );

  printCalorieList(services.output, result);
}

function validateDateRange(options: ListOptions): void {
  if (options.from && options.to && options.from > options.to) {
    throw new CliUsageError('Date from must be before or equal to date to.');
  }
}
