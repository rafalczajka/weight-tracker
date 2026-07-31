import type {
  BmiPostResponse,
  BmiRange,
  CalorieResult,
  ProteinResult,
} from '@weight-tracker/api-client';
import chalk from 'chalk';
import Table from 'cli-table3';
import type { CliOutput } from '../output';
import { formatLabel } from './format';

export function printBmiResult(
  output: CliOutput,
  result: BmiPostResponse,
): void {
  output.print();
  printValue(output, 'BMI', result.bmi.toFixed(2));
  printValue(output, 'Category', formatLabel(result.category));
  printValue(output, 'Classification', formatLabel(result.classification));
  output.print();
  output.print(chalk.bold(`${formatLabel(result.classification)} BMI ranges`));
  output.print(createBmiRangesTable(result).toString());
  output.print();
}

export function printCalorieResult(
  output: CliOutput,
  result: CalorieResult,
): void {
  output.print();
  printValue(
    output,
    'Resting calories',
    `${result.restingCaloriesPerDay} kcal/day`,
  );
  printValue(
    output,
    'Maintenance calories',
    `${result.maintenanceCaloriesPerDay} kcal/day`,
  );
  output.print();
}

export function printProteinResult(
  output: CliOutput,
  result: ProteinResult,
): void {
  output.print();
  printValue(
    output,
    'Daily protein',
    `${result.minimumProteinGramsPerDay}-${result.maximumProteinGramsPerDay} g/day`,
  );
  output.print();
}

function createBmiRangesTable(result: BmiPostResponse): Table.Table {
  const table = new Table({
    colAligns: ['left', 'right'],
    head: ['Category', 'BMI'],
  });

  for (const range of result.ranges) {
    const values = [formatLabel(range.category), formatBmiRange(range)];
    table.push(
      range.category === result.category
        ? values.map(value => chalk.bold.cyan(value))
        : values,
    );
  }

  return table;
}

function formatBmiRange(range: BmiRange): string {
  if (range.minimumInclusive == null) {
    return `BMI < ${formatNumber(range.maximumExclusive)}`;
  }

  if (range.maximumExclusive == null) {
    return `BMI >= ${formatNumber(range.minimumInclusive)}`;
  }

  return `${formatNumber(range.minimumInclusive)} <= BMI < ${formatNumber(
    range.maximumExclusive,
  )}`;
}

function formatNumber(value: number | null | undefined): string {
  return value == null ? '' : value.toString();
}

function printValue(output: CliOutput, label: string, value: string): void {
  output.print(`${chalk.bold(`${label}:`)} ${chalk.bold.cyan(value)}`);
}
