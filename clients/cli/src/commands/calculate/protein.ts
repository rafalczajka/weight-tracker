import {
  calculateProtein as requestProteinCalculation,
  withBearerToken,
  type ProteinGoal,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { printProteinResult } from '../../presentation/calculations';
import type { CliServices } from '../../services';
import { parseWeightKg } from '../../validation';
import { runWithAccessToken } from '../helpers';
import { parseProteinGoal } from './validation';

interface ProteinOptions extends OptionValues {
  goal: ProteinGoal;
  weight: number;
}

export function createProteinCommand(services: CliServices): Command {
  return new Command('protein')
    .description('Calculate daily protein requirements')
    .requiredOption('--weight <kg>', 'Weight in kg', parseWeightKg)
    .requiredOption(
      '--goal <value>',
      'general-health or muscle-gain',
      parseProteinGoal,
    )
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
          goal: options.goal,
          weightKg: options.weight,
        },
      });

      return response.data;
    },
  );

  printProteinResult(services.output, result);
}
