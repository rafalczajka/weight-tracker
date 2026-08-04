import type {
  WeightStats,
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';
import chalk from 'chalk';
import Table from 'cli-table3';
import { WEIGHT_UNIT } from '@/constants';
import type { CliOutput } from '@/output';
import { formatUtcDate } from '@/parsers';

interface AverageComparison {
  label: string;
  preposition: 'than' | 'to';
}

export function printWeightList(
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
    printCurrentWeight(
      output,
      todayEntry.weightKg,
      report.stats.averageWeightKg,
    );
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

    const previousWeightKg = chunk[index - 1]?.weightKg ?? entry.weightKg;
    const differenceKg = entry.weightKg - previousWeightKg;
    const values = [
      entry.date,
      entry.weightKg.toFixed(2),
      `${differenceKg >= 0 ? '+' : ''}${differenceKg.toFixed(2)}`,
    ];

    table.push(
      differenceKg > 0 ? values.map(value => chalk.bold(value)) : values,
    );
  });

  return table;
}

function printStats(output: CliOutput, stats: WeightStats): void {
  printStat(output, 'Max', stats.maximumWeightKg);
  printStat(output, 'Min', stats.minimumWeightKg);
  printStat(output, 'Avg', stats.averageWeightKg);
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
  weightKg: number,
  averageWeightKg: number,
): void {
  const comparison = getAverageComparison(weightKg, averageWeightKg);

  output.print(
    `Current weight ${chalk.bold.cyan(
      `${weightKg.toFixed(2)} ${WEIGHT_UNIT}`,
    )} is ${comparison.label} ${comparison.preposition} average.`,
  );
  output.print();
}

function getAverageComparison(
  weightKg: number,
  averageWeightKg: number,
): AverageComparison {
  if (weightKg < averageWeightKg) {
    return { label: chalk.bold('LOWER'), preposition: 'than' };
  }

  if (weightKg > averageWeightKg) {
    return { label: chalk.bold('HIGHER'), preposition: 'than' };
  }

  return { label: chalk.bold.cyan('EQUAL'), preposition: 'to' };
}
