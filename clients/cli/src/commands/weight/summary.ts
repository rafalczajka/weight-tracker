import { getWeightsSummary, withBearerToken } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { printWeightSummary } from '@/presentation/weight';
import type { CliServices } from '@/services';
import { runWithAccessToken } from '@/commands/helpers';

export function createWeightSummaryCommand(services: CliServices): Command {
  return new Command('summary')
    .description('Show weight tracking summary')
    .action(() => showWeightSummary(services));
}

async function showWeightSummary(services: CliServices): Promise<void> {
  const summary = await runWithAccessToken(
    services,
    'Fetching summary...',
    async accessToken => {
      const response = await getWeightsSummary({
        ...withBearerToken(services.api, accessToken),
      });

      return response.data;
    },
  );

  printWeightSummary(services.output, summary);
}
