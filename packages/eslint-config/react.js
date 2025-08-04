/**
 * React ESLint 配置
 * 专门针对React项目的规则配置
 */

module.exports = {
  extends: [
    './typescript.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y'
  ],
  
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  
  settings: {
    react: {
      version: 'detect'
    }
  },
  
  rules: {
    // React基础规则
    'react/react-in-jsx-scope': 'off', // React 17+不需要
    'react/prop-types': 'off', // 使用TypeScript
    'react/display-name': 'warn',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'error',
    
    // JSX规则
    'react/jsx-uses-react': 'off', // React 17+不需要
    'react/jsx-uses-vars': 'error',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    
    // React Hooks规则
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // 可访问性规则
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    
    // 性能相关
    'react/jsx-no-bind': ['warn', {
      allowArrowFunctions: true,
      allowBind: false,
      ignoreRefs: true
    }],
    'react/no-array-index-key': 'warn',
    'react/no-unstable-nested-components': 'error',
    
    // 最佳实践
    'react/boolean-prop-naming': ['error', { rule: '^(is|has)[A-Z]([A-Za-z0-9]?)+' }],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function'
    }],
    'react/hook-use-state': 'error',
    'react/no-object-type-as-default-prop': 'error',
    'react/prefer-stateless-function': 'error'
  },
  
  overrides: [
    {
      // React组件文件
      files: ['**/*.jsx', '**/*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
};
