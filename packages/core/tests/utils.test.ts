/**
 * 工具函数测试
 */

import { describe, it, expect, vi } from 'vitest';
import {
  generateId,
  generateSessionId,
  getTimestamp,
  safeStringify,
  deepMerge,
  isObject,
  debounce,
  throttle,
  getErrorStack,
  isBrowser,
  isNode,
  safeExecute
} from '../src/utils/index.js';

describe('Utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });
  });

  describe('generateSessionId', () => {
    it('should generate session ID with prefix', () => {
      const sessionId = generateSessionId();
      
      expect(sessionId).toBeDefined();
      expect(sessionId.startsWith('session-')).toBe(true);
      expect(typeof sessionId).toBe('string');
    });
  });

  describe('getTimestamp', () => {
    it('should return current timestamp', () => {
      const timestamp = getTimestamp();
      const now = Date.now();
      
      expect(timestamp).toBeDefined();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeCloseTo(now, -2); // 允许小的时间差
    });
  });

  describe('safeStringify', () => {
    it('should stringify simple objects', () => {
      const obj = { name: 'test', value: 123 };
      const result = safeStringify(obj);
      
      expect(result).toBe('{"name":"test","value":123}');
    });

    it('should handle circular references', () => {
      const obj: any = { name: 'test' };
      obj.self = obj;
      
      const result = safeStringify(obj);
      expect(result).toContain('[Circular]');
    });

    it('should handle functions', () => {
      const obj = { fn: () => {} };
      const result = safeStringify(obj);
      
      expect(result).toContain('[Function]');
    });

    it('should handle errors', () => {
      const error = new Error('test error');
      const result = safeStringify(error);
      
      expect(result).toContain('test error');
      expect(result).toContain('name');
      expect(result).toContain('message');
    });
  });

  describe('deepMerge', () => {
    it('should merge simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const target = { a: { x: 1, y: 2 } };
      const source = { a: { y: 3, z: 4 } };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
    });
  });

  describe('isObject', () => {
    it('should identify objects correctly', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(fn).not.toHaveBeenCalled();
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(fn).toHaveBeenCalledTimes(1);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('getErrorStack', () => {
    it('should extract error stack', () => {
      const error = new Error('test error');
      const stack = getErrorStack(error);
      
      expect(stack).toBeDefined();
      expect(typeof stack).toBe('string');
      expect(stack).toContain('test error');
    });

    it('should handle errors without stack', () => {
      const error = new Error('test error');
      delete error.stack;
      const stack = getErrorStack(error);
      
      expect(stack).toBe('');
    });
  });

  describe('environment detection', () => {
    it('should detect browser environment', () => {
      // 在测试环境中，这些通常返回false
      const result = isBrowser();
      expect(typeof result).toBe('boolean');
    });

    it('should detect Node.js environment', () => {
      const result = isNode();
      expect(typeof result).toBe('boolean');
      // 在Node.js测试环境中应该返回true
      expect(result).toBe(true);
    });
  });

  describe('safeExecute', () => {
    it('should execute function safely', () => {
      const fn = () => 'success';
      const result = safeExecute(fn);
      
      expect(result).toBe('success');
    });

    it('should handle errors with fallback', () => {
      const fn = () => { throw new Error('test error'); };
      const fallback = (error: Error) => `fallback: ${error.message}`;
      const result = safeExecute(fn, fallback);
      
      expect(result).toBe('fallback: test error');
    });

    it('should return undefined on error without fallback', () => {
      const fn = () => { throw new Error('test error'); };
      const result = safeExecute(fn);
      
      expect(result).toBeUndefined();
    });
  });
});
