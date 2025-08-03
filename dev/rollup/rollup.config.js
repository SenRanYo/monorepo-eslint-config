/**
 * Rollup配置 - Rollup Config包
 */

import { createRollupConfig } from './src/index.js';

export default createRollupConfig({
  input: 'src/index.ts',
  name: '@monitor-sdk/rollup-config',
  external: [
    'rollup',
    '@rollup/plugin-commonjs',
    '@rollup/plugin-json',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-replace',
    '@rollup/plugin-terser',
    '@rollup/plugin-typescript',
    'rollup-plugin-dts',
    'path'
  ],
  formats: ['esm', 'cjs']
});
