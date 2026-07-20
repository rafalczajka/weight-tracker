import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const MSAL_EXTENSIONS_IMPORT = /^@azure\/msal-node-extensions$/;
const MSAL_PERSISTENCE_NAMESPACE = 'msal-persistence';
const MSAL_PERSISTENCE_SOURCE = `
  export { DataProtectionScope } from './dist/persistence/DataProtectionScope.mjs';
  export { FilePersistenceWithDataProtection } from './dist/persistence/FilePersistenceWithDataProtection.mjs';
  export { PersistenceCachePlugin } from './dist/persistence/PersistenceCachePlugin.mjs';
`;

const projectRoot = resolve(import.meta.dirname, '..');
const outputDirectory = join(projectRoot, 'dist');
const msalExtensionsDirectory = dirname(
  fileURLToPath(
    import.meta.resolve('@azure/msal-node-extensions/package.json'),
  ),
);
const dpapiLoaderPath = join(projectRoot, 'scripts', 'dpapi-loader.mjs');
const dpapiSourcePath = join(
  msalExtensionsDirectory,
  'bin',
  'x64',
  'dpapi.node',
);
const dpapiOutputPath = join(outputDirectory, 'dpapi.node');

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });

await build({
  banner: { js: '#!/usr/bin/env node' },
  bundle: true,
  entryPoints: [join(projectRoot, 'src/index.ts')],
  format: 'cjs',
  logLevel: 'info',
  outfile: join(outputDirectory, 'wtrack.cjs'),
  platform: 'node',
  plugins: [createMsalPersistencePlugin()],
  sourcemap: true,
  target: 'node22',
});

await copyFile(dpapiSourcePath, dpapiOutputPath);

function createMsalPersistencePlugin() {
  return {
    name: 'msal-persistence',
    setup(buildContext) {
      buildContext.onResolve({ filter: MSAL_EXTENSIONS_IMPORT }, () => ({
        namespace: MSAL_PERSISTENCE_NAMESPACE,
        path: 'index',
      }));

      buildContext.onLoad(
        { filter: /.*/, namespace: MSAL_PERSISTENCE_NAMESPACE },
        () => ({
          contents: MSAL_PERSISTENCE_SOURCE,
          loader: 'js',
          resolveDir: msalExtensionsDirectory,
        }),
      );

      buildContext.onResolve({ filter: /[/\\]Dpapi\.mjs$/ }, args => {
        const importer = args.importer.replaceAll('\\', '/');

        return importer.includes('/@azure/msal-node-extensions/')
          ? { path: dpapiLoaderPath }
          : undefined;
      });
    },
  };
}
