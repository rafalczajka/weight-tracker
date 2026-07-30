import type { CaloriesGetResponse } from '@weight-tracker/api-client';
import Table from 'cli-table3';
import { CALORIE_UNIT } from '../../constants';
import type { CliOutput } from '../../output';

export function printCalorieList(
  output: CliOutput,
  result: CaloriesGetResponse,
): void {
  if (result.data.length === 0) {
    output.print('No calorie entries found.');
    return;
  }

  const table = new Table({
    colAligns: ['center', 'right', 'right'],
    head: ['Date', `Total [${CALORIE_UNIT}]`, 'Entries'],
  });

  for (const day of result.data) {
    table.push([
      day.date,
      day.totalCaloriesKcal.toString(),
      day.entries.length.toString(),
    ]);
  }

  output.print();
  output.print(table.toString());
  output.print();
  output.print(`Days returned: ${result.data.length}`);
  output.print();
}
