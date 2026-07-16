const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const workspaceRoot = path.resolve(__dirname, '../..');

const config = {
  watchFolders: [
    path.resolve(workspaceRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'packages'),
  ],
  resolver: {
    nodeModulesPaths: [path.resolve(workspaceRoot, 'node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
