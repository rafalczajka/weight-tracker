import { InvalidArgumentError } from 'commander';

export function parseProductCode(value: string): string {
  if (!/^\d+$/.test(value)) {
    throw new InvalidArgumentError('Product code must contain digits only.');
  }

  return value;
}
