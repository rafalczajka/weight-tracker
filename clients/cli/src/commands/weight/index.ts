import { Command } from 'commander';
import type { CliServices } from '../../services';
import { createWeightAddCommand } from './add';
import { createWeightGetCommand } from './get';
import { createWeightLatestCommand } from './latest';
import { createWeightListCommand } from './list';
import { createWeightRemoveCommand } from './remove';
import { createWeightSummaryCommand } from './summary';
import { createWeightUpdateCommand } from './update';

export function createWeightCommand(services: CliServices): Command {
  const command = new Command('weight').description('Manage weight entries');

  command.addCommand(createWeightAddCommand(services));
  command.addCommand(createWeightGetCommand(services));
  command.addCommand(createWeightLatestCommand(services));
  command.addCommand(createWeightListCommand(services));
  command.addCommand(createWeightUpdateCommand(services));
  command.addCommand(createWeightRemoveCommand(services));
  command.addCommand(createWeightSummaryCommand(services));
  command.action(() => command.outputHelp());

  return command;
}
