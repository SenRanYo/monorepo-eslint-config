module.exports = {
  extends: ['@monorepo/eslint-config/configs/node'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // 项目特定的规则覆盖
    // Node.js 库中可能需要使用 console.log
    'no-console': 'off',
  },
};
