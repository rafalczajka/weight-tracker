import config from '@weight-tracker/client-config';
import { createWeightTrackerClient } from '@weight-tracker/api-client';
import { createAuthClient } from './auth';
import { createConsoleOutput } from './output';
import { runCli } from './program';

async function main(): Promise<void> {
  const { baseUrl } = config.api;
  const { clientId, tenantId } = config.auth;

  const output = createConsoleOutput();

  const exitCode = await runCli(process.argv.slice(2), {
    api: createWeightTrackerClient({ baseUrl }),
    auth: createAuthClient({ clientId, tenantId }),
    output,
  });

  process.exitCode = exitCode;
}

void main();
