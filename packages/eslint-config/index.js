module.exports = {
  extends: ['./configs/base.js'],

  // 导出规则模块，方便外部使用
  rules: {
    javascript: require('./rules/javascript'),
    import: require('./rules/import'),
    typescript: require('./rules/typescript'),
    react: require('./rules/react'),
    reactHooks: require('./rules/react-hooks'),
    jsxA11y: require('./rules/jsx-a11y'),
    node: require('./rules/node'),
  },

  // 导出预设配置
  presets: {
    javascript: require('./presets/javascript'),
    typescript: require('./presets/typescript'),
    react: require('./presets/react'),
    node: require('./presets/node'),
    customExample: require('./presets/custom-example'),
  },

  // 导出现有配置（向后兼容）
  configs: {
    base: require('./configs/base'),
    typescript: require('./configs/typescript'),
    react: require('./configs/react'),
    node: require('./configs/node'),
  },
};
