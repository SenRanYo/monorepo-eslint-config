/**
 * React 预设
 * 适用于 React + TypeScript 项目
 */
const javascriptRules = require('../rules/javascript');
const importRules = require('../rules/import');
const typescriptRules = require('../rules/typescript');
const reactRules = require('../rules/react');
const reactHooksRules = require('../rules/react-hooks');
const jsxA11yRules = require('../rules/jsx-a11y');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  rules: {
    ...javascriptRules.rules,
    ...importRules.rules,
    ...typescriptRules.rules,
    ...reactRules.rules,
    ...reactHooksRules.rules,
    ...jsxA11yRules.rules,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
