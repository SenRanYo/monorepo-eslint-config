/**
 * TypeScript ESLint 配置
 * 专门针对TypeScript项目的规则配置
 */

module.exports = {
  extends: [
    './base.cjs',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking'
  ],
  
  parser: '@typescript-eslint/parser',
  
  plugins: [
    '@typescript-eslint'
  ],
  
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  
  rules: {
    'no-console': 'error',
    // 禁用与TypeScript冲突的规则
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-redeclare': 'off',
    'no-use-before-define': 'off',
    
    // TypeScript特定规则
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    
    // 类型安全
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off', // 可能过于严格
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    
    // 命名约定
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I']
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      },
      {
        selector: 'enum',
        format: ['PascalCase']
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      },
      {
        selector: 'class',
        format: ['PascalCase']
      },
      {
        selector: 'method',
        format: ['camelCase']
      },
      {
        selector: 'property',
        format: ['camelCase', 'UPPER_CASE']
      }
    ],
    
    // 导入规则
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false
      }
    ],
    
    // 性能相关
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error'
  },
  
  overrides: [
    {
      // 测试文件的特殊规则
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    }
  ]
};
