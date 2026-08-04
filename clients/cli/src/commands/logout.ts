import { Command } from 'commander';
import type { CliServices } from '@/services';
import { printMessage } from './helpers';

export function createLogoutCommand(services: CliServices): Command {
  return new Command('logout').description('Sign out').action(async () => {
    await services.auth.logout();
    printMessage(services, 'Signed out.');
  });
}
