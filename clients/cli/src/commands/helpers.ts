import type { CliServices } from '@/services';

export async function runWithAccessToken<T>(
  services: CliServices,
  status: string,
  action: (accessToken: string) => Promise<T>,
): Promise<T> {
  return services.output.withStatus(status, async () => {
    const accessToken = await services.auth.acquireToken();
    return action(accessToken);
  });
}

export function printMessage(services: CliServices, message: string): void {
  services.output.print();
  services.output.print(message);
  services.output.print();
}
