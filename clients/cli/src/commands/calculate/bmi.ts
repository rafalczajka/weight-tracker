import {
  calculateBmi as requestBmiCalculation,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { printBmiResult } from '../../presentation/calculations';
import type { CliServices } from '../../services';
import { parseWeightKg } from '../../validation';
import { runWithAccessToken } from '../helpers';
import { parseHeightCm } from './validation';

interface BmiOptions extends OptionValues {
  height: number;
  weight: number;
}

export function createBmiCommand(services: CliServices): Command {
  return new Command('bmi')
    .description('Calculate adult BMI')
    .requiredOption('--weight <kg>', 'Weight in kg', parseWeightKg)
    .requiredOption('--height <cm>', 'Height in cm', parseHeightCm)
    .action((options: BmiOptions) => calculateBmi(services, options));
}

async function calculateBmi(
  services: CliServices,
  options: BmiOptions,
): Promise<void> {
  const result = await runWithAccessToken(
    services,
    'Calculating BMI...',
    async accessToken => {
      const response = await requestBmiCalculation({
        ...withBearerToken(services.api, accessToken),
        body: {
          heightCm: options.height,
          weightKg: options.weight,
        },
      });

      return response.data;
    },
  );

  printBmiResult(services.output, result);
}
