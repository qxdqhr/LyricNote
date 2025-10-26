/**
 * i18n 国际化初始化
 */

import { initI18n, zhCN, enUS } from '@lyricnote/shared';
import { WebI18nAdapter } from '@lyricnote/shared/i18n/web';

let isInitialized = false;

/**
 * 初始化 i18n
 */
export async function initializeI18n() {
  if (isInitialized) return;

  try {
    const adapter = new WebI18nAdapter();
    const savedLocale = await adapter.loadLocale();
    const systemLocale = adapter.getSystemLocale();

    initI18n({
      locale: savedLocale || systemLocale,
      fallbackLocale: 'zh-CN',
      resources: {
        'zh-CN': zhCN,
        'en-US': enUS,
      },
    });

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);

    // 降级方案：使用默认中文
    initI18n({
      locale: 'zh-CN',
      fallbackLocale: 'zh-CN',
      resources: {
        'zh-CN': zhCN,
        'en-US': enUS,
      },
    });

    isInitialized = true;
  }
}

// 自动初始化（客户端）
if (typeof window !== 'undefined') {
  initializeI18n();
}

// 重新导出 hooks 和组件
export { useTranslation, useLocale } from '@lyricnote/shared';
