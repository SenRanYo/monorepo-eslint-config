/**
 * 事件发射器基类
 * 提供事件的订阅、发布和管理功能
 */

import { EventEmitter as BaseEventEmitter } from 'eventemitter3';

export type EventListener<T = any> = (data: T) => void;

export interface IEventEmitter {
  on<T = any>(event: string, listener: EventListener<T>): this;
  off<T = any>(event: string, listener: EventListener<T>): this;
  emit<T = any>(event: string, data?: T): boolean;
  once<T = any>(event: string, listener: EventListener<T>): this;
  removeAllListeners(event?: string): this;
  listenerCount(event: string): number;
}

/**
 * 监控SDK事件发射器
 * 继承自eventemitter3，提供类型安全的事件处理
 */
export class EventEmitter extends BaseEventEmitter implements IEventEmitter {
  private _maxListeners = 10;

  constructor() {
    super();
    this.setMaxListeners(this._maxListeners);
  }

  /**
   * 设置最大监听器数量
   * @param n 最大数量
   */
  public setMaxListeners(n: number): this {
    this._maxListeners = n;
    // BaseEventEmitter doesn't have setMaxListeners method
    return this;
  }

  /**
   * 获取最大监听器数量
   * @returns 最大数量
   */
  public getMaxListeners(): number {
    return this._maxListeners;
  }

  /**
   * 安全地发射事件
   * @param event 事件名称
   * @param data 事件数据
   * @returns 是否有监听器处理了事件
   */
  public safeEmit<T = any>(event: string, data?: T): boolean {
    try {
      return this.emit(event, data);
    } catch (error) {
      // 避免事件处理器中的错误影响主流程
      console.error(`Error in event listener for "${event}":`, error);
      return false;
    }
  }

  /**
   * 添加一次性监听器（带超时）
   * @param event 事件名称
   * @param listener 监听器函数
   * @param timeout 超时时间（毫秒）
   * @returns this
   */
  public onceWithTimeout<T = any>(
    event: string,
    listener: EventListener<T>,
    timeout: number
  ): this {
    const timeoutId = setTimeout(() => {
      this.off(event, listener);
    }, timeout);

    const wrappedListener: EventListener<T> = (data: T) => {
      clearTimeout(timeoutId);
      listener(data);
    };

    return this.once(event, wrappedListener);
  }

  /**
   * 批量移除监听器
   * @param events 事件名称数组
   */
  public removeListeners(events: string[]): void {
    events.forEach(event => {
      this.removeAllListeners(event);
    });
  }

  /**
   * 获取所有事件名称
   * @returns 事件名称数组
   */
  public getEventNames(): string[] {
    return this.eventNames() as string[];
  }

  /**
   * 检查是否有指定事件的监听器
   * @param event 事件名称
   * @returns 是否有监听器
   */
  public hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0;
  }

  /**
   * 销毁事件发射器
   * 移除所有监听器并清理资源
   */
  public destroy(): void {
    this.removeAllListeners();
  }
}
