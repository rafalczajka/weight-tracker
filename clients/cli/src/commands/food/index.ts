import { Command } from 'commander';
import type { CliServices } from '@/services';
import { createFoodGetCommand } from './get';

export function createFoodCommand(services: CliServices): Command {
  const command = new Command('food').description('Look up food products');

  command.addCommand(createFoodGetCommand(services));
  command.action(() => command.outputHelp());

  return command;
}
