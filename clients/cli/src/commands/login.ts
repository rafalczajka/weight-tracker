import { Command } from 'commander';
import type { CliServices } from '../services';
import { printMessage } from './helpers';

export function createLoginCommand(services: CliServices): Command {
  return new Command('login')
    .aliases(['signin'])
    .description('aliases: signin')
    .action(async () => {
      await services.output.withStatus('Signing in...', () =>
        services.auth.acquireToken(),
      );
      printMessage(services, 'Signed in.');
    });
}
