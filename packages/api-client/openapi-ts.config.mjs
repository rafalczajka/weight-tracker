import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: '../../app-api/src/WeightTracker.Api/openapi.json',
  output: {
    // Hey API's bundled runtime does not compile with exactOptionalPropertyTypes.
    header: context => ['// @ts-nocheck', ...context.defaultValue],
    path: 'src/generated',
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/client-fetch',
    {
      name: '@hey-api/sdk',
      auth: true,
      operations: {
        strategy: 'flat',
      },
    },
  ],
});
