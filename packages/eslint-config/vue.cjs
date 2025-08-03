/**
 * Vue ESLint 配置
 * 专门针对Vue项目的规则配置
 */

module.exports = {
  extends: [
    './typescript.cjs',
    'plugin:vue/vue3-recommended'
  ],
  
  plugins: [
    'vue'
  ],
  
  parser: 'vue-eslint-parser',
  
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue']
  },
  
  rules: {
    // Vue基础规则
    'vue/multi-word-component-names': 'error',
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'warn',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    
    // Vue 3特定规则
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-deprecated-slot-scope-attribute': 'error',
    'vue/no-deprecated-v-on-native-modifier': 'error',
    'vue/no-lifecycle-after-await': 'error',
    'vue/no-watch-after-await': 'error',
    'vue/prefer-import-from-vue': 'error',
    
    // 模板规则
    'vue/html-indent': ['error', 2],
    'vue/html-quotes': ['error', 'double'],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'always',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    
    // 脚本规则
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/v-on-event-hyphenation': ['error', 'always'],
    
    // 样式规则
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/block-tag-newline': ['error', {
      singleline: 'always',
      multiline: 'always'
    }],
    'vue/padding-line-between-blocks': ['error', 'always'],
    
    // 性能相关
    'vue/no-setup-props-destructure': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/prefer-separate-static-class': 'error',
    
    // 最佳实践
    'vue/define-macros-order': ['error', {
      order: ['defineProps', 'defineEmits', 'defineExpose']
    }],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/define-emits-declaration': ['error', 'type-based'],
    'vue/no-required-prop-with-default': 'error',
    'vue/no-boolean-default': ['error', 'default-false'],
    'vue/require-macro-variable-name': ['error', {
      defineProps: 'props',
      defineEmits: 'emit',
      defineSlots: 'slots',
      useSlots: 'slots',
      useAttrs: 'attrs'
    }]
  },
  
  overrides: [
    {
      // Vue单文件组件
      files: ['**/*.vue'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
};
