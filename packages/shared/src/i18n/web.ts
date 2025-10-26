/**
 * Web 平台专用导出
 * 用于 Next.js、React Web 等环境
 */

// 只导出 Web 相关的适配器（从单独的文件导入，避免引入 React Native）
export { WebI18nAdapter, ElectronI18nAdapter } from './adapters/web';

// 重新导出核心功能
export { createI18n, initI18n, getI18n, t } from './i18n';
export { useTranslation, useLocale } from './hooks';
export {
  LanguageSwitcher,
  LanguageSwitcherButtons,
  LanguageSwitcherDropdown,
  LanguageSwitcherIcon,
} from './components/LanguageSwitcher';
export { default as zhCN } from './locales/zh-CN';
export { default as enUS } from './locales/en-US';

// 类型导出
export type {
  Locale,
  Translations,
  I18nConfig,
  I18nInstance,
  I18nAdapter,
  LanguageSwitcherProps,
} from './index';

