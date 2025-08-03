module.exports = {
  extends: ['@monorepo/eslint-config/configs/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // 项目特定的规则覆盖
    // 例如：'no-console': 'off',
  },
};
