/**
 * 平台适配器
 * 用于不同平台的语言检测和存储
 */

import type { Locale, I18nAdapter } from './types';

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
 * React Native 平台适配器
 */
export class ReactNativeI18nAdapter implements I18nAdapter {
  private storageKey = '@app_locale';

  getSystemLocale(): Locale {
    // 需要导入 react-native 的 Platform 和 NativeModules
    // 这里提供简化版本
    try {
      // @ts-ignore
      const { Platform, NativeModules } = require('react-native');
      const locale =
        Platform.OS === 'ios'
          ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0]
          : NativeModules.I18nManager.localeIdentifier;

      return this.normalizeLocale(locale);
    } catch {
      return 'zh-CN';
    }
  }

  async saveLocale(locale: Locale): Promise<void> {
    try {
      // @ts-ignore
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(this.storageKey, locale);
    } catch (error) {
      console.error('Failed to save locale:', error);
    }
  }

  async loadLocale(): Promise<Locale | null> {
    try {
      // @ts-ignore
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const stored = await AsyncStorage.getItem(this.storageKey);
      return stored as Locale | null;
    } catch (error) {
      console.error('Failed to load locale:', error);
      return null;
    }
  }

  private normalizeLocale(locale: string): Locale {
    const map: Record<string, Locale> = {
      'zh-CN': 'zh-CN',
      zh_CN: 'zh-CN',
      'zh-Hans': 'zh-CN',
      zh_Hans_CN: 'zh-CN',
      'zh-TW': 'zh-TW',
      zh_TW: 'zh-TW',
      'zh-Hant': 'zh-TW',
      zh_Hant_TW: 'zh-TW',
      'en-US': 'en-US',
      en_US: 'en-US',
      en: 'en-US',
      'ja-JP': 'ja-JP',
      ja_JP: 'ja-JP',
      ja: 'ja-JP',
    };
    return map[locale] || 'zh-CN';
  }
}

/**
 * Taro (小程序) 平台适配器
 */
export class TaroI18nAdapter implements I18nAdapter {
  private storageKey = 'app_locale';

  getSystemLocale(): Locale {
    try {
      // @ts-ignore
      const Taro = require('@tarojs/taro').default;
      const systemInfo = Taro.getSystemInfoSync();
      return this.normalizeLocale(systemInfo.language);
    } catch {
      return 'zh-CN';
    }
  }

  async saveLocale(locale: Locale): Promise<void> {
    try {
      // @ts-ignore
      const Taro = require('@tarojs/taro').default;
      await Taro.setStorage({
        key: this.storageKey,
        data: locale,
      });
    } catch (error) {
      console.error('Failed to save locale:', error);
    }
  }

  async loadLocale(): Promise<Locale | null> {
    try {
      // @ts-ignore
      const Taro = require('@tarojs/taro').default;
      const res = await Taro.getStorage({
        key: this.storageKey,
      });
      return res.data as Locale | null;
    } catch (error) {
      return null;
    }
  }

  private normalizeLocale(locale: string): Locale {
    const map: Record<string, Locale> = {
      zh_CN: 'zh-CN',
      'zh-CN': 'zh-CN',
      zh_TW: 'zh-TW',
      'zh-TW': 'zh-TW',
      en: 'en-US',
      'en-US': 'en-US',
      ja: 'ja-JP',
      'ja-JP': 'ja-JP',
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
