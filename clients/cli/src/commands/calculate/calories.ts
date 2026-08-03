import {
  calculateCalories as requestCalorieCalculation,
  withBearerToken,
  type ActivityLevel,
  type Sex,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { printCalorieResult } from '../../presentation/calculations';
import type { CliServices } from '../../services';
import {
  parseActivityLevel,
  parseAgeYears,
  parseHeightCm,
  parseSex,
  parseWeightKg,
} from '../../parsers';
import { runWithAccessToken } from '../helpers';

interface CalorieOptions extends OptionValues {
  activity?: ActivityLevel;
  age?: number;
  height?: number;
  sex?: Sex;
  weight?: number;
}

export function createCaloriesCommand(services: CliServices): Command {
  return new Command('calories')
    .description('Calculate daily calorie requirements')
    .option('--weight <kg>', 'Weight in kg', parseWeightKg)
    .option('--height <cm>', 'Height in cm', parseHeightCm)
    .option('--age <years>', 'Age in years', parseAgeYears)
    .option('--sex <value>', 'female or male', parseSex)
    .option(
      '--activity <level>',
      'sedentary, lightly-active, moderately-active, very-active, or extra-active',
      parseActivityLevel,
    )
    .action((options: CalorieOptions) => calculateCalories(services, options));
}

async function calculateCalories(
  services: CliServices,
  options: CalorieOptions,
): Promise<void> {
  const result = await runWithAccessToken(
    services,
    'Calculating calories...',
    async accessToken => {
      const response = await requestCalorieCalculation({
        ...withBearerToken(services.api, accessToken),
        body: {
          activityLevel: options.activity ?? null,
          ageYears: options.age ?? null,
          heightCm: options.height ?? null,
          sex: options.sex ?? null,
          weightKg: options.weight ?? null,
        },
      });

      return response.data;
    },
  );

  printCalorieResult(services.output, result);
}
