import {
  getWeightEntry,
  getWeights,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { showWeightChart } from '../chart';
import { DATE_FORMAT_LABEL, DEFAULT_MOVING_AVERAGE_DAYS } from '../constants';
import { CliUsageError } from '../errors';
import { printReport, printSpecificEntry } from '../presentation/report';
import type { CliServices } from '../services';
import { parseDate, parseMovingAverageDays, parseTail } from '../validation';
import { runWithAccessToken } from './helpers';

interface ReportOptions extends OptionValues {
  dateFrom?: string;
  dateTo?: string;
  movingAverage?: number;
  plot: boolean;
  tail: number;
}

export function createReportCommand(services: CliServices): Command {
  return new Command('report')
    .aliases(['show', 'get', 'list', 'ls', 'display'])
    .description('aliases: show, get, list, ls, display')
    .argument(
      '[date]',
      `Specific date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .option(
      '--date-from <date>',
      `Start date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .option(
      '--date-to <date>',
      `End date in ${DATE_FORMAT_LABEL} format`,
      parseDate,
    )
    .option('--tail <count>', 'Show only last N records in table', parseTail, 7)
    .option('--plot', 'Display chart in browser')
    .option(
      '--moving-average <days>',
      `Moving-average window for --plot (default: ${DEFAULT_MOVING_AVERAGE_DAYS})`,
      parseMovingAverageDays,
    )
    .action(async (date: string | undefined, options: ReportOptions) => {
      validateReportOptions(date, options);

      if (date) {
        const entry = await getEntry(services, date);
        printSpecificEntry(services.output, entry);
        return;
      }

      const report = await getReport(services, options);
      const now = services.now?.() ?? new Date();

      printReport(services.output, report, options.tail, now);

      if (options.plot && report.data.length > 0) {
        await services.output.withStatus('Plotting data...', () =>
          showWeightChart(report),
        );
      }
    });
}

async function getEntry(services: CliServices, date: string) {
  return runWithAccessToken(services, 'Fetching data...', async accessToken => {
    const response = await getWeightEntry({
      ...withBearerToken(services.api, accessToken),
      path: { date },
    });

    return response.data;
  });
}

async function getReport(services: CliServices, options: ReportOptions) {
  return runWithAccessToken(services, 'Fetching data...', async accessToken => {
    const response = await getWeights({
      ...withBearerToken(services.api, accessToken),
      query: {
        ...(options.dateFrom ? { from: options.dateFrom } : {}),
        ...(options.dateTo ? { to: options.dateTo } : {}),
        ...(options.plot
          ? {
              movingAverageDays:
                options.movingAverage ?? DEFAULT_MOVING_AVERAGE_DAYS,
            }
          : {}),
      },
    });

    return response.data;
  });
}

function validateReportOptions(
  date: string | undefined,
  options: ReportOptions,
): void {
  if (date && (options.dateFrom || options.dateTo)) {
    throw new CliUsageError(
      'Use either a specific date or --date-from/--date-to.',
    );
  }

  if (date && options.plot) {
    throw new CliUsageError(
      'The --plot option cannot be used with a specific date.',
    );
  }

  if (options.movingAverage !== undefined && !options.plot) {
    throw new CliUsageError(
      'The --moving-average option can only be used with --plot.',
    );
  }

  if (options.dateFrom && options.dateTo && options.dateFrom > options.dateTo) {
    throw new CliUsageError('Date from must be before or equal to date to.');
  }
}
