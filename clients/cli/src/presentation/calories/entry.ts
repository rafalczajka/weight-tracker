import type { CalorieEntryDetailsResponse } from '@weight-tracker/api-client';
import chalk from 'chalk';
import { CALORIE_UNIT } from '@/constants';
import type { CliOutput } from '@/output';

export function printCalorieEntry(
  output: CliOutput,
  entry: CalorieEntryDetailsResponse,
  title: string,
): void {
  output.print();
  output.print(chalk.bold(title));
  output.print();
  printValue(output, 'ID', entry.id);
  printValue(output, 'Date', entry.date);
  printValue(output, 'Calories', `${entry.caloriesKcal} ${CALORIE_UNIT}`);

  if (entry.description) {
    printValue(output, 'Description', entry.description);
  }

  output.print();
}

function printValue(output: CliOutput, label: string, value: string): void {
  output.print(`${chalk.bold(`${label}:`)} ${value}`);
}
