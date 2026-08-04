import { getFood, withBearerToken } from '@weight-tracker/api-client';
import { Command } from 'commander';
import { printProduct } from '@/presentation/food';
import type { CliServices } from '@/services';
import { runWithAccessToken } from '@/commands/helpers';
import { parseProductCode } from './validation';

export function createFoodGetCommand(services: CliServices): Command {
  return new Command('get')
    .description('Get a food product by barcode')
    .argument('<code>', 'Product barcode', parseProductCode)
    .action((code: string) => getFoodProduct(services, code));
}

async function getFoodProduct(
  services: CliServices,
  code: string,
): Promise<void> {
  const product = await runWithAccessToken(
    services,
    'Fetching product...',
    async accessToken => {
      const response = await getFood({
        ...withBearerToken(services.api, accessToken),
        path: { code },
      });

      return response.data;
    },
  );

  printProduct(services.output, product);
}
