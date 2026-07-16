import type { Client } from '@weight-tracker/api-client';
import type { AuthClient } from './auth';
import type { CliOutput } from './output';

export interface CliServices {
  api: Client;
  auth: AuthClient;
  now?: () => Date;
  output: CliOutput;
}
