module.exports = {
  extends: ['@monorepo/eslint-config/configs/typescript'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // 项目特定的规则覆盖
    // 工具库可能需要更严格的类型检查
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
