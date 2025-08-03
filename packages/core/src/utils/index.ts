/**
 * 工具函数集合
 * 提供监控SDK需要的各种工具方法
 */

/**
 * 生成唯一ID
 * @returns 唯一标识符
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 生成会话ID
 * @returns 会话标识符
 */
export function generateSessionId(): string {
  return `session-${generateId()}`;
}

/**
 * 获取当前时间戳
 * @returns 时间戳（毫秒）
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * 安全的JSON序列化
 * @param obj 要序列化的对象
 * @param maxDepth 最大深度
 * @returns 序列化后的字符串
 */
export function safeStringify(obj: any, maxDepth = 3): string {
  const seen = new WeakSet();
  
  const replacer = (_key: string, value: any, depth = 0): any => {
    if (depth > maxDepth) {
      return '[Object]';
    }
    
    if (value === null) {
      return null;
    }
    
    if (typeof value === 'undefined') {
      return '[Undefined]';
    }
    
    if (typeof value === 'function') {
      return '[Function]';
    }
    
    if (typeof value === 'symbol') {
      return '[Symbol]';
    }
    
    if (typeof value === 'object') {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
      
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
      }
      
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      if (Array.isArray(value)) {
        return value.map((item, index) => 
          replacer(index.toString(), item, depth + 1)
        );
      }
      
      const result: any = {};
      for (const [k, v] of Object.entries(value)) {
        result[k] = replacer('', v, depth + 1);
      }
      return result;
    }
    
    return value;
  };
  
  try {
    return JSON.stringify(obj, (key, value) => replacer(key, value));
  } catch (error) {
    return JSON.stringify({ error: 'Failed to serialize object' });
  }
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param sources 源对象数组
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) {
    return target;
  }
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
}

/**
 * 判断是否为对象
 * @param item 要判断的项
 * @returns 是否为对象
 */
export function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 获取错误堆栈信息
 * @param error 错误对象
 * @returns 格式化的堆栈信息
 */
export function getErrorStack(error: Error): string {
  if (!error.stack) {
    return '';
  }
  
  return error.stack
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

/**
 * 检查是否在浏览器环境
 * @returns 是否在浏览器环境
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * 检查是否在Node.js环境
 * @returns 是否在Node.js环境
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && Boolean(process.versions?.node);
}

/**
 * 安全执行函数
 * @param fn 要执行的函数
 * @param fallback 失败时的回调
 * @returns 执行结果
 */
export function safeExecute<T>(
  fn: () => T,
  fallback?: (error: Error) => T
): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (fallback) {
      return fallback(error as Error);
    }
    return undefined;
  }
}
