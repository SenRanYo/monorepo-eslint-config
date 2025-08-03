const reactRules = require('../rules/react');
const reactHooksRules = require('../rules/react-hooks');
const jsxA11yRules = require('../rules/jsx-a11y');

module.exports = {
  extends: [
    './typescript.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...reactRules.rules,
    ...reactHooksRules.rules,
    ...jsxA11yRules.rules,
  },
};
