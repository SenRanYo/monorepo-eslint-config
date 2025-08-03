/**
 * Node.js 预设
 * 适用于 Node.js + TypeScript 项目
 */
const javascriptRules = require('../rules/javascript');
const importRules = require('../rules/import');
const typescriptRules = require('../rules/typescript');
const nodeRules = require('../rules/node');

module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'node',
  ],
  rules: {
    ...javascriptRules.rules,
    ...importRules.rules,
    ...typescriptRules.rules,
    ...nodeRules.rules,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
