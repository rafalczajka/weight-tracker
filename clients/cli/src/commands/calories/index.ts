import { Command } from 'commander';
import type { CliServices } from '../../services';
import { createCalorieAddCommand } from './add';
import { createCalorieGetCommand } from './get';
import { createCalorieListCommand } from './list';
import { createCalorieRemoveCommand } from './remove';
import { createCalorieUpdateCommand } from './update';

export function createCaloriesCommand(services: CliServices): Command {
  const command = new Command('calories').description('Manage calorie entries');

  command.addCommand(createCalorieAddCommand(services));
  command.addCommand(createCalorieGetCommand(services));
  command.addCommand(createCalorieListCommand(services));
  command.addCommand(createCalorieUpdateCommand(services));
  command.addCommand(createCalorieRemoveCommand(services));
  command.action(() => command.outputHelp());

  return command;
}
