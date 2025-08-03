/**
 * React监控Hooks
 * 提供React组件中使用监控功能的便捷方法
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { ReactSDK } from '../ReactSDK.js';
import { UserActionType, PerformanceType } from '@monitor-sdk/core';

/**
 * 使用监控SDK的Hook
 * @param sdk 监控SDK实例
 * @returns 监控方法集合
 */
export function useMonitor(sdk: ReactSDK) {
  // 捕获错误
  const captureError = useCallback((error: Error | string, extra?: Record<string, any>) => {
    sdk.captureError(error, extra);
  }, [sdk]);

  // 捕获性能指标
  const capturePerformance = useCallback((name: string, value: number, type: PerformanceType) => {
    sdk.capturePerformance(name, value, type);
  }, [sdk]);

  // 捕获用户行为
  const captureUserAction = useCallback((type: UserActionType, description: string, extra?: Record<string, any>) => {
    sdk.captureUserAction(type, description, extra);
  }, [sdk]);

  // 设置用户信息
  const setUser = useCallback((user: any) => {
    sdk.setUser(user);
  }, [sdk]);

  // 设置标签
  const setTag = useCallback((key: string, value: string) => {
    sdk.setTag(key, value);
  }, [sdk]);

  return useMemo(() => ({
    captureError,
    capturePerformance,
    captureUserAction,
    setUser,
    setTag
  }), [captureError, capturePerformance, captureUserAction, setUser, setTag]);
}

/**
 * 组件性能追踪Hook
 * @param componentName 组件名称
 * @param sdk 监控SDK实例
 */
export function useComponentPerformance(componentName: string, sdk: ReactSDK) {
  const renderStartTime = useRef<number>();

  useEffect(() => {
    // 组件挂载时开始计时
    renderStartTime.current = performance.now();
    sdk.trackComponentRenderStart(componentName);

    return () => {
      // 组件卸载时结束计时
      if (renderStartTime.current) {
        sdk.trackComponentRenderEnd(componentName);
      }
    };
  }, [componentName, sdk]);

  // 每次渲染时更新计时
  useEffect(() => {
    if (renderStartTime.current) {
      sdk.trackComponentRenderEnd(componentName);
    }
    renderStartTime.current = performance.now();
    sdk.trackComponentRenderStart(componentName);
  });
}

/**
 * 错误边界Hook
 * @param sdk 监控SDK实例
 * @returns 错误处理方法
 */
export function useErrorBoundary(sdk: ReactSDK) {
  const captureReactError = useCallback((error: Error, errorInfo: { componentStack: string }) => {
    sdk.captureReactError(error, errorInfo);
  }, [sdk]);

  return { captureReactError };
}

/**
 * 用户交互追踪Hook
 * @param sdk 监控SDK实例
 * @returns 交互追踪方法
 */
export function useUserInteraction(sdk: ReactSDK) {
  const trackClick = useCallback((elementName: string, extra?: Record<string, any>) => {
    sdk.captureUserAction(UserActionType.CLICK, `Clicked ${elementName}`, {
      element: elementName,
      framework: 'React',
      ...extra
    });
  }, [sdk]);

  const trackInput = useCallback((fieldName: string, value?: string) => {
    sdk.captureUserAction(UserActionType.INPUT, `Input in ${fieldName}`, {
      field: fieldName,
      hasValue: Boolean(value),
      framework: 'React'
    });
  }, [sdk]);

  const trackCustomAction = useCallback((action: string, description: string, extra?: Record<string, any>) => {
    sdk.captureUserAction(UserActionType.CUSTOM, description, {
      action,
      framework: 'React',
      ...extra
    });
  }, [sdk]);

  return useMemo(() => ({
    trackClick,
    trackInput,
    trackCustomAction
  }), [trackClick, trackInput, trackCustomAction]);
}

/**
 * 页面视图追踪Hook
 * @param pageName 页面名称
 * @param sdk 监控SDK实例
 */
export function usePageView(pageName: string, sdk: ReactSDK) {
  useEffect(() => {
    sdk.captureUserAction(UserActionType.NAVIGATION, `Viewed page: ${pageName}`, {
      page: pageName,
      url: window.location.href,
      framework: 'React'
    });
  }, [pageName, sdk]);
}

/**
 * 异步操作追踪Hook
 * @param sdk 监控SDK实例
 * @returns 异步操作追踪方法
 */
export function useAsyncTracking(sdk: ReactSDK) {
  const trackAsyncStart = useCallback((operationName: string) => {
    const startTime = performance.now();
    
    return {
      end: (success: boolean = true, error?: Error) => {
        const duration = performance.now() - startTime;
        
        if (success) {
          sdk.capturePerformance(`async_${operationName}`, duration, PerformanceType.CUSTOM);
        } else {
          sdk.captureError(error || new Error(`Async operation failed: ${operationName}`), {
            operation: operationName,
            duration,
            framework: 'React'
          });
        }
      }
    };
  }, [sdk]);

  return { trackAsyncStart };
}
