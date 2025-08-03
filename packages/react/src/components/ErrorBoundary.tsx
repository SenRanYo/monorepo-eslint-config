/**
 * React错误边界组件
 * 自动捕获React组件树中的错误并发送到监控系统
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import type { ReactSDK } from '../ReactSDK.js';

interface Props {
  /** 监控SDK实例 */
  sdk: ReactSDK;
  /** 子组件 */
  children: ReactNode;
  /** 错误时的回退UI */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  /** 错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 是否在开发环境显示错误详情 */
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 监控错误边界组件
 */
export class MonitorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { sdk, onError } = this.props;

    // 更新状态
    this.setState({
      error,
      errorInfo
    });

    // 发送错误到监控系统
    sdk.captureReactError(error, errorInfo);

    // 调用自定义错误处理器
    onError?.(error, errorInfo);

    // 在开发环境打印错误详情
    if (process.env.NODE_ENV === 'development') {
      console.error('React Error Boundary caught an error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showErrorDetails } = this.props;

    if (hasError && error) {
      // 如果提供了自定义回退UI
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, errorInfo!);
        }
        return fallback;
      }

      // 默认错误UI
      return (
        <div style={{
          padding: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '4px',
          backgroundColor: '#ffe0e0',
          color: '#d63031',
          fontFamily: 'monospace'
        }}>
          <h2>Something went wrong</h2>
          <p>An error occurred in this component tree.</p>
          
          {showErrorDetails && process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '10px' }}>
              <summary>Error Details</summary>
              <pre style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f8f8f8',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {error.toString()}
                {errorInfo?.componentStack}
              </pre>
            </details>
          )}
          
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#d63031',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return children;
  }
}

/**
 * 高阶组件：为组件添加错误边界
 * @param WrappedComponent 要包装的组件
 * @param sdk 监控SDK实例
 * @param options 选项
 * @returns 包装后的组件
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  sdk: ReactSDK,
  options: {
    fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    showErrorDetails?: boolean;
  } = {}
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <MonitorErrorBoundary
      sdk={sdk}
      fallback={options.fallback}
      onError={options.onError}
      showErrorDetails={options.showErrorDetails}
    >
      <WrappedComponent {...props} />
    </MonitorErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}
