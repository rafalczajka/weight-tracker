import { Command } from 'commander';
import type { CliServices } from '../services';
import { printMessage } from './helpers';

export function createLogoutCommand(services: CliServices): Command {
  return new Command('logout')
    .aliases(['signout'])
    .description('aliases: signout')
    .action(async () => {
      await services.auth.logout();
      printMessage(services, 'Signed out.');
    });
}
