/**
 * 基础 JavaScript 预设
 * 适用于纯 JavaScript 项目
 */
const javascriptRules = require('../rules/javascript');
const importRules = require('../rules/import');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'import',
  ],
  rules: {
    ...javascriptRules.rules,
    ...importRules.rules,
  },
};
