import { getWeightsSummary, withBearerToken } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { printStatus } from '../presentation/status';
import type { CliServices } from '../services';
import { runWithAccessToken } from './helpers';

export function createStatusCommand(services: CliServices): Command {
  return new Command('status')
    .aliases(['streak'])
    .description('aliases: streak')
    .action(async () => {
      const summary = await runWithAccessToken(
        services,
        'Checking status...',
        async accessToken => {
          const response = await getWeightsSummary({
            ...withBearerToken(services.api, accessToken),
          });

          return response.data;
        },
      );

      printStatus(services.output, summary);
    });
}
