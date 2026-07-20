import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { getRawAsset, isSea } from 'node:sea';

const DPAPI_ASSET_NAME = 'dpapi.node';
const TEMP_DIRECTORY_NAME = 'wtrack';

if (process.platform !== 'win32') {
  throw new Error('DPAPI is supported only on Windows.');
}

function loadDpapi() {
  const addon = resolveDpapiAddon();

  try {
    return loadNativeAddon(addon.path);
  } finally {
    if (addon.isTemporary) {
      removeExtractedAddon(addon.path);
    }
  }
}

function resolveDpapiAddon() {
  if (isSea()) {
    return {
      isTemporary: true,
      path: extractSeaAddon(),
    };
  }

  return {
    isTemporary: false,
    path: join(dirname(process.argv[1]), DPAPI_ASSET_NAME),
  };
}

function extractSeaAddon() {
  const directory = join(tmpdir(), TEMP_DIRECTORY_NAME);
  const addonPath = join(directory, `dpapi-${process.pid}.node`);

  mkdirSync(directory, { recursive: true });
  writeFileSync(addonPath, new Uint8Array(getRawAsset(DPAPI_ASSET_NAME)));

  return addonPath;
}

function loadNativeAddon(addonPath) {
  const nativeModule = { exports: {} };

  process.dlopen(nativeModule, addonPath);

  return nativeModule.exports;
}

function removeExtractedAddon(addonPath) {
  try {
    rmSync(addonPath, { force: true });
  } catch {
    // Windows may retain the loaded module until the process exits.
  }
}

export const Dpapi = loadDpapi();
