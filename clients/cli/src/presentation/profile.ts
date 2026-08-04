import type { UserResponse } from '@weight-tracker/api-client';
import chalk from 'chalk';
import Table from 'cli-table3';
import type { CliOutput } from '@/output';
import { formatLabel } from './format';

export function printUserProfile(
  output: CliOutput,
  profile: UserResponse,
  title = 'User profile',
): void {
  const table = new Table();

  table.push(
    ['Height', formatOptional(profile.heightCm, value => `${value} cm`)],
    ['Sex', formatOptional(profile.sex, formatLabel)],
    ['Date of birth', formatOptional(profile.dateOfBirth)],
    ['Activity', formatOptional(profile.activityLevel, formatLabel)],
    ['Protein goal', formatOptional(profile.proteinGoal, formatLabel)],
  );

  output.print();
  output.print(chalk.bold(title));
  output.print(table.toString());
  output.print();
}

function formatOptional<T>(
  value: T | null | undefined,
  format: (value: T) => string = String,
): string {
  return value == null ? chalk.dim('Not set') : format(value);
}
