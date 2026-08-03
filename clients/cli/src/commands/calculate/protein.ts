import {
  calculateProtein as requestProteinCalculation,
  withBearerToken,
  type ProteinGoal,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { printProteinResult } from '../../presentation/calculations';
import type { CliServices } from '../../services';
import { parseProteinGoal, parseWeightKg } from '../../parsers';
import { runWithAccessToken } from '../helpers';

interface ProteinOptions extends OptionValues {
  goal?: ProteinGoal;
  weight?: number;
}

export function createProteinCommand(services: CliServices): Command {
  return new Command('protein')
    .description('Calculate daily protein requirements')
    .option('--weight <kg>', 'Weight in kg', parseWeightKg)
    .option('--goal <value>', 'general-health or muscle-gain', parseProteinGoal)
    .action((options: ProteinOptions) => calculateProtein(services, options));
}

async function calculateProtein(
  services: CliServices,
  options: ProteinOptions,
): Promise<void> {
  const result = await runWithAccessToken(
    services,
    'Calculating protein...',
    async accessToken => {
      const response = await requestProteinCalculation({
        ...withBearerToken(services.api, accessToken),
        body: {
          goal: options.goal ?? null,
          weightKg: options.weight ?? null,
        },
      });

      return response.data;
    },
  );

  printProteinResult(services.output, result);
}
