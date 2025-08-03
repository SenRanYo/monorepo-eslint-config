/**
 * Rollup配置生成器
 * 提供统一的构建配置，支持ESM/CJS/IIFE格式
 */

import type { RollupOptions, OutputOptions } from 'rollup';
import { resolve } from 'path';

/**
 * 构建配置选项
 */
export interface IBuildConfig {
  /** 入口文件路径 */
  input: string;
  /** 输出目录 */
  outputDir?: string;
  /** 包名称 */
  name?: string;
  /** 全局变量名（用于IIFE格式） */
  globalName?: string;
  /** 外部依赖 */
  external?: string[];
  /** 是否生成压缩版本 */
  minify?: boolean;
  /** 是否生成类型声明文件 */
  generateTypes?: boolean;
  /** 是否生成源码映射 */
  sourcemap?: boolean;
  /** 自定义替换变量 */
  replace?: Record<string, string>;
  /** 目标格式 */
  formats?: Array<'esm' | 'cjs' | 'iife'>;
  /** TypeScript配置文件路径 */
  tsconfig?: string;
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Partial<IBuildConfig> = {
  outputDir: 'dist',
  minify: true,
  generateTypes: true,
  sourcemap: true,
  formats: ['esm', 'cjs', 'iife'],
  tsconfig: './tsconfig.json'
};

/**
 * 创建Rollup配置
 * @param config 构建配置
 * @returns Rollup配置数组
 */
export function createRollupConfig(config: IBuildConfig): RollupOptions[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const {
    input,
    outputDir,
    name,
    globalName,
    external = [],
    minify,
    generateTypes,
    sourcemap,
    replace = {},
    formats = ['esm', 'cjs', 'iife'],
    tsconfig
  } = finalConfig;

  // 基础插件
  const plugins = createPlugins({
    replace,
    tsconfig: tsconfig!,
    generateTypes: generateTypes!
  });

  // 输出配置
  const outputs: OutputOptions[] = [];

  // ESM格式
  if (formats.includes('esm')) {
    outputs.push({
      file: resolve(outputDir!, 'index.js'),
      format: 'es',
      sourcemap
    });

    if (minify) {
      outputs.push({
        file: resolve(outputDir!, 'index.min.js'),
        format: 'es',
        sourcemap,
        plugins: [createTerserPlugin()]
      });
    }
  }

  // CJS格式
  if (formats.includes('cjs')) {
    outputs.push({
      file: resolve(outputDir!, 'index.cjs'),
      format: 'cjs',
      sourcemap,
      exports: 'auto'
    });

    if (minify) {
      outputs.push({
        file: resolve(outputDir!, 'index.min.cjs'),
        format: 'cjs',
        sourcemap,
        exports: 'auto',
        plugins: [createTerserPlugin()]
      });
    }
  }

  // IIFE格式
  if (formats.includes('iife')) {
    const iifeName = globalName || name || 'MonitorSDK';
    
    outputs.push({
      file: resolve(outputDir!, 'index.iife.js'),
      format: 'iife',
      name: iifeName,
      sourcemap
    });

    if (minify) {
      outputs.push({
        file: resolve(outputDir!, 'index.iife.min.js'),
        format: 'iife',
        name: iifeName,
        sourcemap,
        plugins: [createTerserPlugin()]
      });
    }
  }

  const configs: RollupOptions[] = [
    {
      input,
      external,
      plugins,
      output: outputs
    }
  ];

  // 生成类型声明文件的单独配置
  if (generateTypes) {
    configs.push({
      input,
      external,
      plugins: [createDtsPlugin()],
      output: {
        file: resolve(outputDir!, 'index.d.ts'),
        format: 'es'
      }
    });
  }

  return configs;
}

/**
 * 创建基础插件
 */
function createPlugins(options: {
  replace: Record<string, string>;
  tsconfig: string;
  generateTypes: boolean;
}) {
  const { replace: replaceVars, tsconfig } = options;

  // 动态导入插件
  const plugins: any[] = [];

  // Node resolve插件
  plugins.push(createNodeResolvePlugin());

  // CommonJS插件
  plugins.push(createCommonJSPlugin());

  // JSON插件
  plugins.push(createJsonPlugin());

  // TypeScript插件
  plugins.push(createTypeScriptPlugin(tsconfig));

  // Replace插件
  if (Object.keys(replaceVars).length > 0) {
    plugins.push(createReplacePlugin(replaceVars));
  }

  return plugins;
}

/**
 * 创建Node Resolve插件
 */
function createNodeResolvePlugin() {
  // 动态导入以避免构建时依赖问题
  return import('@rollup/plugin-node-resolve').then(({ nodeResolve }) =>
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ['node']
    })
  );
}

/**
 * 创建CommonJS插件
 */
function createCommonJSPlugin() {
  return import('@rollup/plugin-commonjs').then(({ default: commonjs }) =>
    commonjs()
  );
}

/**
 * 创建JSON插件
 */
function createJsonPlugin() {
  return import('@rollup/plugin-json').then(({ default: json }) =>
    json()
  );
}

/**
 * 创建TypeScript插件
 */
function createTypeScriptPlugin(tsconfig: string) {
  return import('@rollup/plugin-typescript').then(({ default: typescript }) =>
    typescript({
      tsconfig,
      declaration: false, // 类型声明由单独的配置生成
      declarationMap: false
    })
  );
}

/**
 * 创建Replace插件
 */
function createReplacePlugin(replaceVars: Record<string, string>) {
  return import('@rollup/plugin-replace').then(({ default: replace }) =>
    replace({
      preventAssignment: true,
      values: replaceVars
    })
  );
}

/**
 * 创建Terser插件（压缩）
 */
function createTerserPlugin() {
  return import('@rollup/plugin-terser').then(({ default: terser }) =>
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        reserved: ['MonitorSDK']
      }
    })
  );
}

/**
 * 创建DTS插件（类型声明）
 */
function createDtsPlugin() {
  return import('rollup-plugin-dts').then(({ default: dts }) =>
    dts()
  );
}

/**
 * 创建监控SDK专用配置
 * @param packageName 包名称
 * @param options 额外选项
 * @returns Rollup配置
 */
export function createMonitorSDKConfig(
  packageName: string,
  options: Partial<IBuildConfig> = {}
): RollupOptions[] {
  const version = process.env.npm_package_version || '1.0.0';
  const environment = process.env.NODE_ENV || 'production';

  return createRollupConfig({
    input: 'src/index.ts',
    name: packageName,
    globalName: packageName.replace('@monitor-sdk/', '').replace('-', ''),
    external: [
      '@monitor-sdk/core',
      '@monitor-sdk/web',
      'react',
      'react-dom',
      'vue',
      'eventemitter3'
    ],
    replace: {
      __VERSION__: JSON.stringify(version),
      __ENVIRONMENT__: JSON.stringify(environment),
      'process.env.NODE_ENV': JSON.stringify(environment)
    },
    ...options
  });
}

/**
 * 预设配置
 */
export const presets = {
  /**
   * 核心包配置
   */
  core: (options: Partial<IBuildConfig> = {}) =>
    createMonitorSDKConfig('@monitor-sdk/core', {
      external: ['eventemitter3'],
      ...options
    }),

  /**
   * Web包配置
   */
  web: (options: Partial<IBuildConfig> = {}) =>
    createMonitorSDKConfig('@monitor-sdk/web', {
      external: ['@monitor-sdk/core'],
      ...options
    }),

  /**
   * React包配置
   */
  react: (options: Partial<IBuildConfig> = {}) =>
    createMonitorSDKConfig('@monitor-sdk/react', {
      external: ['@monitor-sdk/core', '@monitor-sdk/web', 'react', 'react-dom'],
      ...options
    }),

  /**
   * Vue包配置
   */
  vue: (options: Partial<IBuildConfig> = {}) =>
    createMonitorSDKConfig('@monitor-sdk/vue', {
      external: ['@monitor-sdk/core', '@monitor-sdk/web', 'vue'],
      ...options
    })
};
