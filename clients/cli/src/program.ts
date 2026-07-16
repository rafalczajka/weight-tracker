import { ApiError } from '@weight-tracker/api-client';
import { Command, CommanderError } from 'commander';
import {
  createAddCommand,
  createLoginCommand,
  createLogoutCommand,
  createRemoveCommand,
  createReportCommand,
  createStatusCommand,
  createUpdateCommand,
} from './commands';
import { CLI_NAME } from './constants';
import { AppError, CliUsageError } from './errors';
import type { CliServices } from './services';

export type { CliServices } from './services';

export function createProgram(services: CliServices): Command {
  const program = new Command()
    .name(CLI_NAME)
    .description('Weight Tracker command-line client')
    .showHelpAfterError()
    .exitOverride();

  const commands = [
    createLoginCommand(services),
    createLogoutCommand(services),
    createStatusCommand(services),
    createAddCommand(services),
    createReportCommand(services),
    createUpdateCommand(services),
    createRemoveCommand(services),
  ];

  for (const command of commands) {
    command.exitOverride();
    program.addCommand(command);
  }

  return program;
}

export async function runCli(
  arguments_: string[],
  services: CliServices,
): Promise<number> {
  const program = createProgram(services);

  if (arguments_.length === 0) {
    program.outputHelp();
    return 0;
  }

  try {
    await program.parseAsync(arguments_, { from: 'user' });
    return 0;
  } catch (error) {
    if (error instanceof CommanderError) {
      return error.code === 'commander.helpDisplayed' ? 0 : 2;
    }

    if (error instanceof CliUsageError) {
      services.output.printError(error.message);
      return 2;
    }

    if (error instanceof ApiError || error instanceof AppError) {
      services.output.printError(error.message);
      return 1;
    }

    services.output.printError('Unexpected application error.');
    return 1;
  }
}
