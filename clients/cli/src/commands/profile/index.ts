import { Command } from 'commander';
import type { CliServices } from '@/services';
import { createProfileClearCommand } from './clear';
import { createProfileGetCommand } from './get';
import { createProfileResetCommand } from './reset';
import { createProfileUpdateCommand } from './update';

export function createProfileCommand(services: CliServices): Command {
  const command = new Command('profile').description(
    'Manage the current user profile',
  );

  command.addCommand(createProfileGetCommand(services));
  command.addCommand(createProfileUpdateCommand(services));
  command.addCommand(createProfileClearCommand(services));
  command.addCommand(createProfileResetCommand(services));
  command.action(() => command.outputHelp());

  return command;
}
