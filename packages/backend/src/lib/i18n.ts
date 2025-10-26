/**
 * i18n 国际化初始化
 * 
 * 注意: 必须在构建时(服务端)和运行时(客户端)都能工作
 */

import { initI18n, zhCN, enUS } from '@lyricnote/shared';
import { WebI18nAdapter } from '@lyricnote/shared/i18n/web';

let isInitialized = false;

/**
 * 同步初始化 i18n (用于服务端构建)
 */
function initializeI18nSync() {
  if (isInitialized) return;

  try {
    // 服务端默认使用中文,客户端会根据实际情况切换
    initI18n({
      locale: 'zh-CN',
      fallbackLocale: 'zh-CN',
      resources: {
        'zh-CN': zhCN,
        'en-US': enUS,
      },
    });

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
  }
}

/**
 * 异步初始化 i18n (用于客户端,读取保存的语言设置)
 */
export async function initializeI18n() {
  if (!isInitialized) {
    // 如果还没初始化,先同步初始化
    initializeI18nSync();
  }

  // 客户端环境:尝试读取保存的语言设置
  if (typeof window !== 'undefined') {
    try {
      const adapter = new WebI18nAdapter();
      const savedLocale = await adapter.loadLocale();
      const systemLocale = adapter.getSystemLocale();

      // 重新初始化,使用保存的语言
      isInitialized = false;
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
      console.error('Failed to load saved locale:', error);
    }
  }
}

// 立即同步初始化(服务端和客户端都执行)
initializeI18nSync();

// 客户端额外执行异步初始化
if (typeof window !== 'undefined') {
  initializeI18n();
}

// 重新导出 hooks 和组件
export { useTranslation, useLocale } from '@lyricnote/shared';
