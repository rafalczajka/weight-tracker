import type { WeightsSummaryGetResponse } from '@weight-tracker/api-client';
import chalk from 'chalk';
import { WEIGHT_UNIT } from '../constants';
import type { CliOutput } from '../output';

const ADHERENCE_WINDOW = 30;
const STATUS_OK = '\u2713';
const STATUS_NO = '\u2717';

export function printStatus(
  output: CliOutput,
  summary: WeightsSummaryGetResponse,
): void {
  output.print();

  if (summary.today.hasEntry && summary.today.weight != null) {
    output.print(
      `${chalk.bold.cyan(STATUS_OK)} Data added: ${chalk.bold.cyan(
        `${summary.today.weight} ${WEIGHT_UNIT}`,
      )}`,
    );
  } else {
    output.print(`${chalk.bold.magenta(STATUS_NO)} No entry yet today.`);
  }

  output.print();
  output.print(
    `${chalk.bold('Streak:')} ${chalk.bold.cyan(
      formatDays(summary.streak.current),
    )} (best: ${chalk.bold.cyan(formatDays(summary.streak.longest))})`,
  );

  for (const adherence of summary.adherence) {
    if (adherence.window === ADHERENCE_WINDOW) {
      output.print(
        `${chalk.bold(`Adherence (${adherence.window}d):`)} ${chalk.bold.cyan(
          adherence.daysMissed,
        )} missed`,
      );
    }
  }

  output.print();
}

function formatDays(days: number): string {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}
