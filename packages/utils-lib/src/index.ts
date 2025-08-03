/**
 * 字符串工具函数
 */
export namespace StringUtils {
  /**
   * 将字符串转换为驼峰命名
   */
  export function toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  /**
   * 将字符串转换为短横线命名
   */
  export function toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * 截断字符串
   */
  export function truncate(str: string, length: number, suffix = '...'): string {
    if (str.length <= length) {
      return str;
    }
    return str.slice(0, length - suffix.length) + suffix;
  }
}

/**
 * 数组工具函数
 */
export namespace ArrayUtils {
  /**
   * 数组去重
   */
  export function unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  /**
   * 数组分块
   */
  export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 数组扁平化
   */
  export function flatten<T>(array: (T | T[])[]): T[] {
    return array.reduce<T[]>((acc, val) => {
      return acc.concat(Array.isArray(val) ? flatten(val) : val);
    }, []);
  }
}

/**
 * 对象工具函数
 */
export namespace ObjectUtils {
  /**
   * 深拷贝对象
   */
  export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T;
    }

    if (obj instanceof Array) {
      return obj.map(item => deepClone(item)) as T;
    }

    if (typeof obj === 'object') {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }

    return obj;
  }

  /**
   * 获取对象的嵌套属性值
   */
  export function get<T>(obj: Record<string, unknown>, path: string, defaultValue?: T): T | undefined {
    const keys = path.split('.');
    let result: unknown = obj;

    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      result = (result as Record<string, unknown>)[key];
    }

    return result as T ?? defaultValue;
  }
}

/**
 * 延迟执行函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
