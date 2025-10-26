/**
 * i18n 使用示例
 */

import React from 'react';
import { initI18n, useTranslation, zhCN, enUS } from '../index';
import { WebI18nAdapter } from './web';

// =========================
// 1. 初始化示例
// =========================

// 在应用启动时初始化
export function initializeI18n() {
  initI18n({
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    resources: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  });
}

// =========================
// 2. React 组件示例
// =========================

// 基础使用
export function BasicExample() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.confirm')}</button>
      <button>{t('common.cancel')}</button>
    </div>
  );
}

// 语言切换
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div>
      <p>当前语言: {locale}</p>
      <select value={locale} onChange={(e) => setLocale(e.target.value as any)}>
        <option value="zh-CN">简体中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
  );
}

// 插值示例
export function InterpolationExample() {
  const { t } = useTranslation();
  const username = '张三';

  return (
    <div>
      <p>
        {t('validation.required', {
          context: { field: '用户名' },
        })}
      </p>
      <p>
        {t('validation.password_too_short', {
          context: { count: 8 },
        })}
      </p>
    </div>
  );
}

// 复数示例
export function PluralExample() {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('items', { count: 1 })}</p>
      <p>{t('items', { count: 5 })}</p>
    </div>
  );
}

// 嵌套键示例
export function NestedKeyExample() {
  const { t } = useTranslation();

  return (
    <div>
      <label>{t('user.username')}</label>
      <input type="text" />

      <label>{t('user.password')}</label>
      <input type="password" />
    </div>
  );
}

// =========================
// 3. 平台适配器示例
// =========================

// Web 平台初始化
export async function initWebI18n() {
  const adapter = new WebI18nAdapter();

  // 尝试加载保存的语言
  const savedLocale = await adapter.loadLocale();

  // 如果没有保存的语言，使用系统语言
  const locale = savedLocale || adapter.getSystemLocale();

  // 初始化 i18n
  initI18n({
    locale,
    fallbackLocale: 'zh-CN',
    resources: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  });
}

// 保存语言选择
export async function saveLanguagePreference(locale: string) {
  const adapter = new WebI18nAdapter();
  await adapter.saveLocale(locale as any);
}

// =========================
// 4. 完整的语言切换组件
// =========================

export function LanguageSelector() {
  const { locale, setLocale } = useTranslation();

  const handleLanguageChange = async (newLocale: string) => {
    // 更新 i18n
    setLocale(newLocale as any);

    // 保存到本地存储
    await saveLanguagePreference(newLocale);

    // 可选：通知服务器
    // await updateUserLanguage(newLocale);
  };

  return (
    <div className="language-selector">
      <button
        className={locale === 'zh-CN' ? 'active' : ''}
        onClick={() => handleLanguageChange('zh-CN')}
      >
        中文
      </button>
      <button
        className={locale === 'en-US' ? 'active' : ''}
        onClick={() => handleLanguageChange('en-US')}
      >
        English
      </button>
    </div>
  );
}

// =========================
// 5. 表单验证示例
// =========================

export function LoginForm() {
  const { t } = useTranslation();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = (values: any) => {
    const newErrors: Record<string, string> = {};

    if (!values.username) {
      newErrors.username = t('validation.required', {
        context: { field: t('user.username') },
      });
    }

    if (!values.password) {
      newErrors.password = t('validation.required', {
        context: { field: t('user.password') },
      });
    } else if (values.password.length < 8) {
      newErrors.password = t('validation.password_too_short', {
        context: { count: 8 },
      });
    }

    return newErrors;
  };

  return (
    <form>
      <div>
        <label>{t('user.username')}</label>
        <input type="text" />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <label>{t('user.password')}</label>
        <input type="password" />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit">{t('user.login')}</button>
    </form>
  );
}

// =========================
// 6. 错误消息示例
// =========================

export function ErrorDisplay({ errorType }: { errorType: string }) {
  const { t } = useTranslation();

  const getErrorMessage = (type: string) => {
    const errorMap: Record<string, string> = {
      network: t('errors.network'),
      server: t('errors.server'),
      unauthorized: t('errors.unauthorized'),
      notFound: t('errors.not_found'),
    };

    return errorMap[type] || t('errors.unknown');
  };

  return (
    <div className="error-message">
      <span className="icon">⚠️</span>
      <span>{getErrorMessage(errorType)}</span>
      <button>{t('common.retry')}</button>
    </div>
  );
}

// =========================
// 7. 成功消息示例
// =========================

export function SuccessToast({ action }: { action: 'saved' | 'deleted' | 'updated' | 'created' }) {
  const { t } = useTranslation();

  return (
    <div className="success-toast">
      <span className="icon">✅</span>
      <span>{t(`success.${action}`)}</span>
    </div>
  );
}
