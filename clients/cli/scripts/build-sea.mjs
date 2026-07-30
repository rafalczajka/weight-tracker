import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { inject } from 'postject';

const DPAPI_ASSET_NAME = 'dpapi.node';
const PLOTLY_ASSET_NAME = 'plotly-basic.min.js';
const SEA_BLOB_RESOURCE = 'NODE_SEA_BLOB';
const SEA_SENTINEL_FUSE = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';
const MINIMUM_NODE_MAJOR_VERSION = 22;

const paths = createBuildPaths(resolve(import.meta.dirname, '..'));

assertBuildEnvironment();
await prepareBuildDirectory(paths.buildDirectory);
await writeSeaConfig(paths);
createSeaBlob(paths.seaConfig);
await createExecutable(paths);

console.log(`Created ${paths.executable}`);

function createBuildPaths(projectRoot) {
  const buildDirectory = join(projectRoot, 'build');
  const distDirectory = join(projectRoot, 'dist');

  return {
    blob: join(buildDirectory, 'wtrack.blob'),
    buildDirectory,
    bundle: join(distDirectory, 'wtrack.cjs'),
    dpapiAddon: join(distDirectory, DPAPI_ASSET_NAME),
    executable: join(distDirectory, 'wtrack.exe'),
    plotlyBundle: join(distDirectory, PLOTLY_ASSET_NAME),
    seaConfig: join(buildDirectory, 'sea-config.json'),
  };
}

function assertBuildEnvironment() {
  if (process.platform !== 'win32' || process.arch !== 'x64') {
    throw new Error('The standalone CLI is supported only on Windows x64.');
  }

  const nodeMajorVersion = Number(process.versions.node.split('.')[0]);

  if (nodeMajorVersion < MINIMUM_NODE_MAJOR_VERSION) {
    throw new Error('Building wtrack.exe requires Node.js 22 or newer.');
  }
}

async function prepareBuildDirectory(buildDirectory) {
  await rm(buildDirectory, { force: true, recursive: true });
  await mkdir(buildDirectory, { recursive: true });
}

async function writeSeaConfig(buildPaths) {
  const config = {
    assets: {
      [DPAPI_ASSET_NAME]: buildPaths.dpapiAddon,
      [PLOTLY_ASSET_NAME]: buildPaths.plotlyBundle,
    },
    main: buildPaths.bundle,
    output: buildPaths.blob,
    disableExperimentalSEAWarning: true,
  };

  await writeFile(buildPaths.seaConfig, `${JSON.stringify(config, null, 2)}\n`);
}

function createSeaBlob(seaConfigPath) {
  execFileSync(process.execPath, ['--experimental-sea-config', seaConfigPath], {
    stdio: 'inherit',
  });
}

async function createExecutable(buildPaths) {
  await copyFile(process.execPath, buildPaths.executable);

  const seaBlob = await readFile(buildPaths.blob);

  await inject(buildPaths.executable, SEA_BLOB_RESOURCE, seaBlob, {
    sentinelFuse: SEA_SENTINEL_FUSE,
  });
}
