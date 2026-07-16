import {
  getWeightEntry,
  getWeights,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { DATE_FORMAT_LABEL } from '../constants';
import { CliUsageError } from '../errors';
import { printReport, printSpecificEntry } from '../presentation/report';
import type { CliServices } from '../services';
import { parseDate, parseTail } from '../validation';
import { runWithAccessToken } from './helpers';

interface ReportOptions extends OptionValues {
  dateFrom?: string;
  dateTo?: string;
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

  if (options.dateFrom && options.dateTo && options.dateFrom > options.dateTo) {
    throw new CliUsageError('Date from must be before or equal to date to.');
  }
}
