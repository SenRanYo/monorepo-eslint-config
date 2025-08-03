/**
 * TypeScript 预设
 * 适用于 TypeScript 项目
 */
const javascriptRules = require('../rules/javascript');
const importRules = require('../rules/import');
const typescriptRules = require('../rules/typescript');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
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
  ],
  rules: {
    ...javascriptRules.rules,
    ...importRules.rules,
    ...typescriptRules.rules,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
