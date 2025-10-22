/**
 * 存储适配器导出
 * 为不同平台提供统一的存储接口实现
 */

// 类型定义
export type { StorageAdapter, StorageChangeEvent } from './types';

// 平台适配器（直接导出）
export { WebStorageAdapter } from './web';
export { ReactNativeStorageAdapter } from './react-native';
export { MiniAppStorageAdapter } from './miniapp';
export { ElectronStorageAdapter } from './electron';
