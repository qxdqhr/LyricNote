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

// React Components
export {
  LanguageSwitcher,
  LanguageSwitcherButtons,
  LanguageSwitcherDropdown,
  LanguageSwitcherIcon,
} from './components/LanguageSwitcher';

export type { LanguageSwitcherProps, LanguageOption } from './components/LanguageSwitcher';

// 注意：平台适配器不在此导出，以避免打包工具尝试解析平台特定依赖
// 如果需要使用平台适配器，请直接从对应文件导入：
// - Web: import { WebI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters'
// - React Native: import { ReactNativeI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters'
// - Taro: import { TaroI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters'
// - Electron: import { ElectronI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters'

// 翻译资源
export { default as zhCN } from './locales/zh-CN';
export { default as enUS } from './locales/en-US';

