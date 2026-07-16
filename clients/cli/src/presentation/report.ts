import type {
  StatsResponse,
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';
import chalk from 'chalk';
import Table from 'cli-table3';
import { WEIGHT_UNIT } from '../constants';
import type { CliOutput } from '../output';
import { formatUtcDate } from '../validation';

interface AverageComparison {
  label: string;
  preposition: 'than' | 'to';
}

export function printSpecificEntry(
  output: CliOutput,
  entry: WeightsEntryResponse,
): void {
  output.print();
  output.print(`Date: ${chalk.bold.cyan(entry.date)}`);
  output.print(`Weight: ${chalk.bold.cyan(`${entry.weight} ${WEIGHT_UNIT}`)}`);
  output.print();
}

export function printReport(
  output: CliOutput,
  report: WeightsGetResponse,
  tail: number,
  now: Date,
): void {
  if (report.data.length === 0) {
    output.print('No data found.');
    return;
  }

  const entries = [...report.data].sort((left, right) =>
    left.date.localeCompare(right.date),
  );
  const table = createWeightTable(entries, tail);

  output.print();
  output.print(`Weight unit: ${chalk.bold.cyan(WEIGHT_UNIT)}`);
  output.print();
  output.print(table.toString());
  output.print();
  output.print(`Displayed: ${Math.min(entries.length, tail)}`);
  output.print(`Total received: ${entries.length}`);
  output.print();
  output.print(
    `Date range: ${chalk.bold.cyan(entries[0]?.date)} - ${chalk.bold.cyan(
      entries.at(-1)?.date,
    )}`,
  );
  output.print();
  printStats(output, report.stats);

  const todayEntry = entries.find(entry => entry.date === formatUtcDate(now));

  if (todayEntry) {
    printCurrentWeight(output, todayEntry.weight, report.stats.avg);
  }
}

function createWeightTable(
  entries: WeightsEntryResponse[],
  tail: number,
): Table.Table {
  const table = new Table({
    colAligns: ['center', 'right', 'right'],
    head: ['Date', 'Weight', '+/-'],
  });

  if (tail === 0) {
    return table;
  }

  const chunk = entries.slice(-(tail + 1));
  const skipFirst = entries.length > tail;

  chunk.forEach((entry, index) => {
    if (index === 0 && skipFirst) {
      return;
    }

    const previousWeight = chunk[index - 1]?.weight ?? entry.weight;
    const difference = entry.weight - previousWeight;
    const values = [
      entry.date,
      entry.weight.toFixed(2),
      `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}`,
    ];

    table.push(
      difference > 0 ? values.map(value => chalk.bold(value)) : values,
    );
  });

  return table;
}

function printStats(output: CliOutput, stats: StatsResponse): void {
  printStat(output, 'Max', stats.max);
  printStat(output, 'Min', stats.min);
  printStat(output, 'Avg', stats.avg);
  output.print();
}

function printStat(output: CliOutput, label: string, value: number): void {
  output.print(
    `${label}: ${chalk.bold.cyan(
      `${value.toFixed(2).padStart(6)} ${WEIGHT_UNIT}`,
    )}`,
  );
}

function printCurrentWeight(
  output: CliOutput,
  weight: number,
  average: number,
): void {
  const comparison = getAverageComparison(weight, average);

  output.print(
    `Current weight ${chalk.bold.cyan(
      `${weight.toFixed(2)} ${WEIGHT_UNIT}`,
    )} is ${comparison.label} ${comparison.preposition} average.`,
  );
  output.print();
}

function getAverageComparison(
  weight: number,
  average: number,
): AverageComparison {
  if (weight < average) {
    return { label: chalk.bold('LOWER'), preposition: 'than' };
  }

  if (weight > average) {
    return { label: chalk.bold('HIGHER'), preposition: 'than' };
  }

  return { label: chalk.bold.cyan('EQUAL'), preposition: 'to' };
}
