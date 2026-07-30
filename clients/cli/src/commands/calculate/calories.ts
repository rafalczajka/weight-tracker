import {
  calculateCalories as requestCalorieCalculation,
  withBearerToken,
  type ActivityLevel,
  type Sex,
} from '@weight-tracker/api-client';
import { Command, type OptionValues } from 'commander';
import { printCalorieResult } from '../../presentation/calculations';
import type { CliServices } from '../../services';
import { parseWeightKg } from '../../validation';
import { runWithAccessToken } from '../helpers';
import {
  parseActivityLevel,
  parseAgeYears,
  parseHeightCm,
  parseSex,
} from './validation';

interface CalorieOptions extends OptionValues {
  activity: ActivityLevel;
  age: number;
  height: number;
  sex: Sex;
  weight: number;
}

export function createCaloriesCommand(services: CliServices): Command {
  return new Command('calories')
    .description('Calculate daily calorie requirements')
    .requiredOption('--weight <kg>', 'Weight in kg', parseWeightKg)
    .requiredOption('--height <cm>', 'Height in cm', parseHeightCm)
    .requiredOption('--age <years>', 'Age in years', parseAgeYears)
    .requiredOption('--sex <value>', 'female or male', parseSex)
    .requiredOption(
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
          activityLevel: options.activity,
          ageYears: options.age,
          heightCm: options.height,
          sex: options.sex,
          weightKg: options.weight,
        },
      });

      return response.data;
    },
  );

  printCalorieResult(services.output, result);
}
