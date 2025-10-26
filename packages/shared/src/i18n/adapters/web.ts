/**
 * Web 平台适配器
 * 用于浏览器环境的语言检测和存储
 */

import type { Locale, I18nAdapter } from '../types';

/**
 * Web 平台适配器
 */
export class WebI18nAdapter implements I18nAdapter {
  private storageKey = 'app_locale';

  getSystemLocale(): Locale {
    const browserLocale = navigator.language;
    return this.normalizeLocale(browserLocale);
  }

  async saveLocale(locale: Locale): Promise<void> {
    localStorage.setItem(this.storageKey, locale);
  }

  async loadLocale(): Promise<Locale | null> {
    const stored = localStorage.getItem(this.storageKey);
    return stored as Locale | null;
  }

  private normalizeLocale(locale: string): Locale {
    const map: Record<string, Locale> = {
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'zh-HK': 'zh-TW',
      zh: 'zh-CN',
      'en-US': 'en-US',
      'en-GB': 'en-US',
      en: 'en-US',
      'ja-JP': 'ja-JP',
      ja: 'ja-JP',
    };
    return map[locale] || 'zh-CN';
  }
}

/**
 * Electron 平台适配器
 */
export class ElectronI18nAdapter implements I18nAdapter {
  private storageKey = 'app_locale';

  getSystemLocale(): Locale {
    const browserLocale = navigator.language;
    return this.normalizeLocale(browserLocale);
  }

  async saveLocale(locale: Locale): Promise<void> {
    localStorage.setItem(this.storageKey, locale);
  }

  async loadLocale(): Promise<Locale | null> {
    const stored = localStorage.getItem(this.storageKey);
    return stored as Locale | null;
  }

  private normalizeLocale(locale: string): Locale {
    const map: Record<string, Locale> = {
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'zh-HK': 'zh-TW',
      zh: 'zh-CN',
      'en-US': 'en-US',
      'en-GB': 'en-US',
      en: 'en-US',
      'ja-JP': 'ja-JP',
      ja: 'ja-JP',
    };
    return map[locale] || 'zh-CN';
  }
}
