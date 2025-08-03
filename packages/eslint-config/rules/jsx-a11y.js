/**
 * JSX A11y 相关规则
 * 包含 JSX 可访问性 (Accessibility) 规则
 */
module.exports = {
  rules: {
    // 基础可访问性规则
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',
    
    // 交互元素规则
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    
    // 表单规则
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/control-has-associated-label': 'off', // 可能与其他规则冲突
    
    // 媒体规则
    'jsx-a11y/media-has-caption': 'off', // 根据项目需求决定
    
    // 自动完成规则
    'jsx-a11y/autocomplete-valid': 'error',
    
    // 语言规则
    'jsx-a11y/lang': 'error',
    
    // 标题规则
    'jsx-a11y/html-has-lang': 'error',
    
    // 焦点规则
    'jsx-a11y/no-autofocus': 'warn', // 警告而不是错误，某些情况下可能需要
    'jsx-a11y/tabindex-no-positive': 'error',
  },
};
