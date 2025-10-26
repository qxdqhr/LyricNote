/**
 * i18n 模块导出
 */

// 核心功能
export { createI18n, initI18n, getI18n, t } from './i18n';

// 类型
export type {
  Locale,
  TranslationKey,
  TranslationValue,
  Translations,
  LocaleResources,
  TranslateOptions,
  I18nConfig,
  I18nInstance,
  I18nAdapter,
} from './types';

// React Hooks
export { useTranslation, useLocale } from './hooks';

// 平台适配器
export {
  WebI18nAdapter,
  ReactNativeI18nAdapter,
  TaroI18nAdapter,
  ElectronI18nAdapter,
} from './adapters';

// 翻译资源
export { default as zhCN } from './locales/zh-CN';
export { default as enUS } from './locales/en-US';

