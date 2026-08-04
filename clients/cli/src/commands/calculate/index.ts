import { Command } from 'commander';
import type { CliServices } from '@/services';
import { createBmiCommand } from './bmi';
import { createCaloriesCommand } from './calories';
import { createProteinCommand } from './protein';

export function createCalculateCommand(services: CliServices): Command {
  const command = new Command('calculate').description(
    'Calculate health metrics',
  );

  command.addCommand(createBmiCommand(services));
  command.addCommand(createCaloriesCommand(services));
  command.addCommand(createProteinCommand(services));
  command.action(() => command.outputHelp());

  return command;
}
