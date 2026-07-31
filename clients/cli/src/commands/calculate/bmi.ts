import {
  calculateBmi as requestBmiCalculation,
  withBearerToken,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { printBmiResult } from '../../presentation/calculations';
import type { CliServices } from '../../services';
import { parseHeightCm, parseWeightKg } from '../../validation';
import { runWithAccessToken } from '../helpers';

interface BmiOptions extends OptionValues {
  height?: number;
  weight?: number;
}

export function createBmiCommand(services: CliServices): Command {
  return new Command('bmi')
    .description('Calculate adult BMI')
    .option('--weight <kg>', 'Weight in kg', parseWeightKg)
    .option('--height <cm>', 'Height in cm', parseHeightCm)
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
          heightCm: options.height ?? null,
          weightKg: options.weight ?? null,
        },
      });

      return response.data;
    },
  );

  printBmiResult(services.output, result);
}
