/**
 * JavaScript 代码质量和最佳实践测试
 * 测试代码质量相关的 ESLint 规则和最佳实践
 */

// ✅ 良好实践：使用严格相等
function compareValues(a, b) {
  return a === b; // 使用 === 而不是 ==
}

function checkTruthy(value) {
  return value !== null && value !== undefined; // 明确检查
}

// ❌ 错误示例：使用宽松相等
function badComparison(a, b) {
  return a == b; // 可能导致意外的类型转换
}

// ✅ 良好实践：避免全局变量
const AppConfig = {
  apiUrl: 'https://api.example.com',
  version: '1.0.0',
  debug: false,
};

// ❌ 错误示例：全局变量
// var globalVariable = 'This pollutes the global scope';

// ✅ 良好实践：使用模块模式
const UserModule = (function() {
  let users = [];
  
  return {
    addUser(user) {
      if (!user || !user.name || !user.email) {
        throw new Error('Invalid user data');
      }
      users.push({ ...user, id: Date.now() });
    },
    
    getUsers() {
      return [...users]; // 返回副本，避免外部修改
    },
    
    getUserById(id) {
      return users.find(user => user.id === id);
    },
    
    removeUser(id) {
      const index = users.findIndex(user => user.id === id);
      if (index > -1) {
        users.splice(index, 1);
        return true;
      }
      return false;
    },
  };
})();

// ✅ 良好实践：输入验证
function validateEmail(email) {
  if (typeof email !== 'string') {
    throw new TypeError('Email must be a string');
  }
  
  if (!email.trim()) {
    throw new Error('Email cannot be empty');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase().trim();
}

function validateAge(age) {
  if (typeof age !== 'number' || isNaN(age)) {
    throw new TypeError('Age must be a number');
  }
  
  if (age < 0 || age > 150) {
    throw new RangeError('Age must be between 0 and 150');
  }
  
  return Math.floor(age);
}

// ✅ 良好实践：错误处理
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error.message);
    return defaultValue;
  }
}

function safeDivide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  
  return a / b;
}

// ✅ 良好实践：不可变性
function updateUser(user, updates) {
  return {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

function addItemToArray(array, item) {
  return [...array, item]; // 返回新数组而不是修改原数组
}

function removeItemFromArray(array, index) {
  if (index < 0 || index >= array.length) {
    throw new RangeError('Index out of bounds');
  }
  
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1),
  ];
}

// ✅ 良好实践：函数式编程
const ArrayUtils = {
  // 纯函数：相同输入总是产生相同输出
  sum(numbers) {
    return numbers.reduce((total, num) => total + num, 0);
  },
  
  average(numbers) {
    if (numbers.length === 0) return 0;
    return this.sum(numbers) / numbers.length;
  },
  
  unique(array) {
    return [...new Set(array)];
  },
  
  groupBy(array, keyFn) {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  },
  
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

// ✅ 良好实践：防抖和节流
function debounce(func, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let inThrottle;
  
  return function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ✅ 良好实践：缓存/记忆化
function memoize(fn) {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ✅ 良好实践：类型检查工具
const TypeChecker = {
  isString(value) {
    return typeof value === 'string';
  },
  
  isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  },
  
  isBoolean(value) {
    return typeof value === 'boolean';
  },
  
  isArray(value) {
    return Array.isArray(value);
  },
  
  isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },
  
  isFunction(value) {
    return typeof value === 'function';
  },
  
  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (this.isString(value) || this.isArray(value)) return value.length === 0;
    if (this.isObject(value)) return Object.keys(value).length === 0;
    return false;
  },
};

// ✅ 良好实践：常量定义
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_INPUT: 'Invalid input provided',
  NETWORK_ERROR: 'Network request failed',
  PERMISSION_DENIED: 'Permission denied',
  RESOURCE_NOT_FOUND: 'Resource not found',
};

// ✅ 良好实践：配置对象
const DEFAULT_CONFIG = {
  timeout: 5000,
  retries: 3,
  debug: false,
  headers: {
    'Content-Type': 'application/json',
  },
};

function createApiClient(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  
  return {
    async get(url) {
      return this.request('GET', url);
    },
    
    async post(url, data) {
      return this.request('POST', url, data);
    },
    
    async request(method, url, data = null) {
      const options = {
        method,
        headers: config.headers,
        timeout: config.timeout,
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        if (config.debug) {
          console.error('API request failed:', error);
        }
        throw error;
      }
    },
  };
}

// ✅ 良好实践：事件处理
class EventManager {
  constructor() {
    this.listeners = new Map();
  }
  
  on(event, listener) {
    if (!TypeChecker.isString(event)) {
      throw new TypeError('Event name must be a string');
    }
    
    if (!TypeChecker.isFunction(listener)) {
      throw new TypeError('Listener must be a function');
    }
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event).add(listener);
  }
  
  off(event, listener) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }
  
  emit(event, ...args) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }
  
  once(event, listener) {
    const onceListener = (...args) => {
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }
}

// ✅ 良好实践：性能优化
const PerformanceUtils = {
  // 批量 DOM 操作
  batchDOMUpdates(updates) {
    const fragment = document.createDocumentFragment();
    updates.forEach(update => update(fragment));
    document.body.appendChild(fragment);
  },
  
  // 延迟执行
  defer(callback) {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(callback);
    } else {
      setTimeout(callback, 0);
    }
  },
  
  // 测量执行时间
  measureTime(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },
};

// ❌ 错误示例：常见的反模式
function antiPatterns() {
  // 修改原型
  // Array.prototype.customMethod = function() {}; // 不要这样做
  
  // 使用 eval
  // const code = 'console.log("Hello")';
  // eval(code); // 安全风险
  
  // 不必要的复杂性
  // const result = condition ? true : false; // 应该直接使用 condition
  
  // 魔法数字
  // setTimeout(callback, 86400000); // 应该使用常量
}

export {
  compareValues,
  checkTruthy,
  AppConfig,
  UserModule,
  validateEmail,
  validateAge,
  safeJsonParse,
  safeDivide,
  updateUser,
  addItemToArray,
  removeItemFromArray,
  ArrayUtils,
  debounce,
  throttle,
  memoize,
  TypeChecker,
  HTTP_STATUS,
  ERROR_MESSAGES,
  DEFAULT_CONFIG,
  createApiClient,
  EventManager,
  PerformanceUtils,
};
