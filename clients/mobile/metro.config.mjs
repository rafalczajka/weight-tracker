import path from 'node:path';
import { getDefaultConfig, mergeConfig } from '@react-native/metro-config';

/** @type {import('@react-native/metro-config').MetroConfig} */
const projectRoot = import.meta.dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = {
  watchFolders: [
    path.resolve(workspaceRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'packages'),
  ],
  resolver: {
    nodeModulesPaths: [path.resolve(workspaceRoot, 'node_modules')],
  },
};

export default mergeConfig(getDefaultConfig(projectRoot), config);
