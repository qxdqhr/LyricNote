/**
 * 存储 Hook 适配器导出
 * 这些适配器专门用于 useStorage Hook
 */

export { WebStorageAdapter as HookWebStorageAdapter } from './web'
export { ReactNativeStorageAdapter as HookReactNativeStorageAdapter } from './react-native'
export { MiniAppStorageAdapter as HookMiniAppStorageAdapter } from './miniapp'

