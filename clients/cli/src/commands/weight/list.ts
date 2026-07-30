import { getWeights, withBearerToken } from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { showWeightChart } from '../../chart';
import {
  DATE_FORMAT_LABEL,
  DEFAULT_MOVING_AVERAGE_DAYS,
} from '../../constants';
import { CliUsageError } from '../../errors';
import { printWeightList } from '../../presentation/weight';
import type { CliServices } from '../../services';
import { parseDate, parseMovingAverageDays, parseTail } from '../../validation';
import { runWithAccessToken } from '../helpers';

interface ListOptions extends OptionValues {
  from?: string;
  movingAverage?: number;
  plot: boolean;
  tail: number;
  to?: string;
}

export function createWeightListCommand(services: CliServices): Command {
  return new Command('list')
    .alias('ls')
    .description('List weight entries')
    .option(
      '--from <date>',
      `Start date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .option('--to <date>', `End date in ${DATE_FORMAT_LABEL} format`, parseDate)
    .option('--tail <count>', 'Show only last N records in table', parseTail, 7)
    .option('--plot', 'Display chart in browser')
    .option(
      '--moving-average <days>',
      `Moving-average window for --plot (default: ${DEFAULT_MOVING_AVERAGE_DAYS})`,
      parseMovingAverageDays,
    )
    .action((options: ListOptions) => listWeights(services, options));
}

async function listWeights(
  services: CliServices,
  options: ListOptions,
): Promise<void> {
  validateOptions(options);

  const report = await getReport(services, options);
  const now = services.now?.() ?? new Date();

  printWeightList(services.output, report, options.tail, now);

  if (options.plot && report.data.length > 0) {
    await services.output.withStatus('Plotting data...', () =>
      showWeightChart(report),
    );
  }
}

async function getReport(services: CliServices, options: ListOptions) {
  return runWithAccessToken(
    services,
    'Fetching weights...',
    async accessToken => {
      const response = await getWeights({
        ...withBearerToken(services.api, accessToken),
        query: {
          ...(options.from ? { from: options.from } : {}),
          ...(options.to ? { to: options.to } : {}),
          ...(options.plot
            ? {
                movingAverageDays:
                  options.movingAverage ?? DEFAULT_MOVING_AVERAGE_DAYS,
              }
            : {}),
        },
      });

      return response.data;
    },
  );
}

function validateOptions(options: ListOptions): void {
  if (options.movingAverage !== undefined && !options.plot) {
    throw new CliUsageError(
      'The --moving-average option can only be used with --plot.',
    );
  }

  if (options.from && options.to && options.from > options.to) {
    throw new CliUsageError('Date from must be before or equal to date to.');
  }
}
