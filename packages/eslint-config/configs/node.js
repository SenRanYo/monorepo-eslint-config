const nodeRules = require('../rules/node');

module.exports = {
  extends: [
    './typescript.js',
    'plugin:node/recommended',
  ],
  plugins: [
    'node',
  ],
  env: {
    node: true,
    browser: false,
  },
  rules: {
    ...nodeRules.rules,
  },
};
