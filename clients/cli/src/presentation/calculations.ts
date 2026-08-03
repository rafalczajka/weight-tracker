import type {
  BmiPostResponse,
  BmiRangeResponse,
  CalorieResult,
  ProteinResult,
} from '@weight-tracker/api-client';
import chalk from 'chalk';
import Table from 'cli-table3';
import type { CliOutput } from '../output';

export function printBmiResult(
  output: CliOutput,
  result: BmiPostResponse,
): void {
  output.print();
  printValue(output, 'Weight', `${result.weightKg} kg`);
  printValue(output, 'Height', `${result.heightCm} cm`);
  printValue(output, 'BMI', result.bmi.toFixed(2));
  printValue(output, 'Category', result.categoryName);
  output.print();
  output.print(chalk.bold('Adult BMI ranges'));
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
    colAligns: ['left', 'right', 'right'],
    head: ['Category', 'BMI', 'Weight'],
  });

  for (const range of result.ranges) {
    const values = [
      range.categoryName,
      formatBmiRange(range),
      formatWeightRange(range),
    ];
    table.push(
      range.category === result.category
        ? values.map(value => chalk.bold.cyan(value))
        : values,
    );
  }

  return table;
}

function formatBmiRange(range: BmiRangeResponse): string {
  if (range.minimumBmiInclusive == null) {
    return `BMI < ${formatNumber(range.maximumBmiExclusive)}`;
  }

  if (range.maximumBmiExclusive == null) {
    return `BMI >= ${formatNumber(range.minimumBmiInclusive)}`;
  }

  return `${formatNumber(range.minimumBmiInclusive)} <= BMI < ${formatNumber(
    range.maximumBmiExclusive,
  )}`;
}

function formatWeightRange(range: BmiRangeResponse): string {
  const minimum = formatWeight(range.minimumWeightKgInclusive);
  const maximum = formatWeight(range.maximumWeightKgExclusive);

  if (!minimum) {
    return `< ${maximum} kg`;
  }

  if (!maximum) {
    return `>= ${minimum} kg`;
  }

  return `${minimum}-${maximum} kg`;
}

function formatWeight(value: number | null | undefined): string {
  return value == null ? '' : value.toFixed(1);
}

function formatNumber(value: number | null | undefined): string {
  return value == null ? '' : value.toString();
}

function printValue(output: CliOutput, label: string, value: string): void {
  output.print(`${chalk.bold(`${label}:`)} ${chalk.bold.cyan(value)}`);
}
