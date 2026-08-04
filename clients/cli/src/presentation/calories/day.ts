import type { DailyCaloriesResponse } from '@weight-tracker/api-client';
import chalk from 'chalk';
import { CALORIE_UNIT } from '@/constants';
import type { CliOutput } from '@/output';

export function printDailyCalories(
  output: CliOutput,
  day: DailyCaloriesResponse,
): void {
  output.print();
  output.print(chalk.bold(day.date));
  output.print(
    `Total: ${chalk.bold.cyan(`${day.totalCaloriesKcal} ${CALORIE_UNIT}`)}`,
  );
  output.print(`Entries: ${day.entries.length}`);
  output.print();

  if (day.entries.length === 0) {
    output.print('No calorie entries found.');
    output.print();
    return;
  }

  day.entries.forEach((entry, index) => {
    const description = entry.description ? ` - ${entry.description}` : '';

    output.print(
      `${index + 1}. ${chalk.bold.cyan(
        `${entry.caloriesKcal} ${CALORIE_UNIT}`,
      )}${description}`,
    );
    output.print(`   ID: ${entry.id}`);
  });

  output.print();
}
