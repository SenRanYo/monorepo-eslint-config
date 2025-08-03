/**
 * 插件管理器
 * 负责插件的注册、加载、卸载和生命周期管理
 */

import type { IPlugin, IMonitorSDK } from '../../types/index.js';
import { EventEmitter } from '../base/EventEmitter.js';

export interface IPluginManager {
  register(plugin: IPlugin): void;
  unregister(pluginName: string): void;
  get(pluginName: string): IPlugin | undefined;
  getAll(): IPlugin[];
  has(pluginName: string): boolean;
  clear(): void;
}

/**
 * 插件管理器实现
 */
export class PluginManager extends EventEmitter implements IPluginManager {
  private plugins: Map<string, IPlugin> = new Map();
  private sdk: IMonitorSDK;

  constructor(sdk: IMonitorSDK) {
    super();
    this.sdk = sdk;
  }

  /**
   * 注册插件
   * @param plugin 插件实例
   */
  public register(plugin: IPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }

    // 验证插件
    this.validatePlugin(plugin);

    try {
      // 安装插件
      plugin.install(this.sdk);
      
      // 存储插件
      this.plugins.set(plugin.name, plugin);
      
      // 发射事件
      this.safeEmit('pluginRegistered', plugin);
      
      console.log(`Plugin "${plugin.name}" registered successfully`);
    } catch (error) {
      console.error(`Failed to register plugin "${plugin.name}":`, error);
      throw error;
    }
  }

  /**
   * 注销插件
   * @param pluginName 插件名称
   */
  public unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin) {
      console.warn(`Plugin "${pluginName}" is not registered`);
      return;
    }

    try {
      // 卸载插件
      plugin.uninstall?.();
      
      // 移除插件
      this.plugins.delete(pluginName);
      
      // 发射事件
      this.safeEmit('pluginUnregistered', plugin);
      
      console.log(`Plugin "${pluginName}" unregistered successfully`);
    } catch (error) {
      console.error(`Failed to unregister plugin "${pluginName}":`, error);
      throw error;
    }
  }

  /**
   * 获取插件
   * @param pluginName 插件名称
   * @returns 插件实例或undefined
   */
  public get(pluginName: string): IPlugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * 获取所有插件
   * @returns 插件数组
   */
  public getAll(): IPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 检查插件是否存在
   * @param pluginName 插件名称
   * @returns 是否存在
   */
  public has(pluginName: string): boolean {
    return this.plugins.has(pluginName);
  }

  /**
   * 清空所有插件
   */
  public clear(): void {
    const pluginNames = Array.from(this.plugins.keys());
    
    pluginNames.forEach(pluginName => {
      try {
        this.unregister(pluginName);
      } catch (error) {
        console.error(`Failed to unregister plugin "${pluginName}" during clear:`, error);
      }
    });
  }

  /**
   * 批量注册插件
   * @param plugins 插件数组
   */
  public registerBatch(plugins: IPlugin[]): void {
    const results: Array<{ plugin: IPlugin; success: boolean; error?: Error }> = [];
    
    plugins.forEach(plugin => {
      try {
        this.register(plugin);
        results.push({ plugin, success: true });
      } catch (error) {
        results.push({ plugin, success: false, error: error as Error });
      }
    });
    
    // 发射批量注册完成事件
    this.safeEmit('batchRegistrationComplete', results);
  }

  /**
   * 获取插件统计信息
   * @returns 统计信息
   */
  public getStats(): {
    total: number;
    active: number;
    plugins: Array<{ name: string; version: string; active: boolean }>;
  } {
    const plugins = this.getAll();
    
    return {
      total: plugins.length,
      active: plugins.length, // 所有注册的插件都被认为是活跃的
      plugins: plugins.map(plugin => ({
        name: plugin.name,
        version: plugin.version,
        active: true
      }))
    };
  }

  /**
   * 验证插件
   * @param plugin 插件实例
   */
  private validatePlugin(plugin: IPlugin): void {
    if (!plugin) {
      throw new Error('Plugin cannot be null or undefined');
    }

    if (!plugin.name || typeof plugin.name !== 'string') {
      throw new Error('Plugin must have a valid name');
    }

    if (!plugin.version || typeof plugin.version !== 'string') {
      throw new Error('Plugin must have a valid version');
    }

    if (!plugin.install || typeof plugin.install !== 'function') {
      throw new Error('Plugin must have an install method');
    }

    // 可选的卸载方法验证
    if (plugin.uninstall && typeof plugin.uninstall !== 'function') {
      throw new Error('Plugin uninstall must be a function if provided');
    }
  }

  /**
   * 销毁插件管理器
   */
  public override destroy(): void {
    this.clear();
    super.destroy();
  }
}
