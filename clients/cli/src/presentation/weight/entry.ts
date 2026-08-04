import type { WeightsEntryResponse } from '@weight-tracker/api-client';
import chalk from 'chalk';
import { WEIGHT_UNIT } from '@/constants';
import type { CliOutput } from '@/output';

export function printWeightEntry(
  output: CliOutput,
  entry: WeightsEntryResponse,
): void {
  output.print();
  output.print(`Date: ${chalk.bold.cyan(entry.date)}`);
  output.print(
    `Weight: ${chalk.bold.cyan(`${entry.weightKg} ${WEIGHT_UNIT}`)}`,
  );
  output.print();
}
