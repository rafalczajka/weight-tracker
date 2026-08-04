import {
  isCalorieDescriptionValid,
  normalizeDescription,
} from '@weight-tracker/client-core';
import { InvalidArgumentError } from 'commander';

export function parseDescription(value: string): string {
  if (!isCalorieDescriptionValid(value)) {
    throw new InvalidArgumentError('Description is too long.');
  }

  return normalizeDescription(value) ?? '';
}
