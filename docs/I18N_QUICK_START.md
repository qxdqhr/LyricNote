# i18n 国际化快速入门

## 概述

LyricNote 项目在 `@lyricnote/shared` 包中内置了轻量级的国际化 (i18n) 解决方案，支持：

- ✅ Web (Next.js)
- ✅ React Native (Mobile)
- ✅ Taro (MiniApp)
- ✅ Electron (Desktop)

## 特点

- **零依赖**：核心功能无外部依赖
- **轻量级**：< 5KB
- **类型安全**：完整的 TypeScript 支持
- **跨平台**：统一的 API，适配不同平台
- **简单易用**：类似 i18next 的 API

## 快速开始

### 1. Backend (Next.js) 集成

#### 创建 i18n 初始化文件

```typescript
// packages/backend/src/lib/i18n.ts
import { initI18n, zhCN, enUS, WebI18nAdapter } from '@lyricnote/shared';

let isInitialized = false;

export async function initializeI18n() {
  if (isInitialized) return;

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
}

export { useTranslation } from '@lyricnote/shared';
```

#### 在根布局中初始化

```typescript
// packages/backend/src/app/layout.tsx
import { initializeI18n } from '@/lib/i18n';

// 在组件外部初始化（确保只初始化一次）
initializeI18n();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
```

#### 在页面中使用

```tsx
// packages/backend/src/app/page.tsx
'use client';

import { useTranslation } from '@/lib/i18n';

export default function HomePage() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('nav.home')}</p>

      {/* 语言切换 */}
      <select value={locale} onChange={(e) => setLocale(e.target.value as any)}>
        <option value="zh-CN">简体中文</option>
        <option value="en-US">English</option>
      </select>
    </div>
  );
}
```

### 2. Mobile (React Native) 集成

```typescript
// packages/mobile/src/lib/i18n.ts
import { initI18n, zhCN, enUS, ReactNativeI18nAdapter } from '@lyricnote/shared';

let isInitialized = false;

export async function initializeI18n() {
  if (isInitialized) return;

  const adapter = new ReactNativeI18nAdapter();
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
}

export { useTranslation } from '@lyricnote/shared';
```

```tsx
// packages/mobile/App.tsx
import React, { useEffect, useState } from 'react';
import { initializeI18n } from './src/lib/i18n';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeI18n().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return <MainApp />;
}
```

### 3. MiniApp (Taro) 集成

```typescript
// packages/miniapp/src/lib/i18n.ts
import { initI18n, zhCN, enUS, TaroI18nAdapter } from '@lyricnote/shared';

let isInitialized = false;

export async function initializeI18n() {
  if (isInitialized) return;

  const adapter = new TaroI18nAdapter();
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
}

export { useTranslation } from '@lyricnote/shared';
```

### 4. Desktop (Electron) 集成

```typescript
// packages/desktop/src/lib/i18n.ts
import { initI18n, zhCN, enUS, ElectronI18nAdapter } from '@lyricnote/shared';

let isInitialized = false;

export async function initializeI18n() {
  if (isInitialized) return;

  const adapter = new ElectronI18nAdapter();
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
}

export { useTranslation } from '@lyricnote/shared';
```

## 通用组件示例

### 语言选择器组件

```tsx
// packages/backend/src/components/LanguageSelector.tsx
'use client';

import { useTranslation } from '@/lib/i18n';
import { WebI18nAdapter } from '@lyricnote/shared';

export function LanguageSelector() {
  const { locale, setLocale } = useTranslation();

  const handleChange = async (newLocale: string) => {
    setLocale(newLocale as any);

    // 保存到本地存储
    const adapter = new WebI18nAdapter();
    await adapter.saveLocale(newLocale as any);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleChange('zh-CN')}
        className={`px-4 py-2 rounded ${locale === 'zh-CN' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        中文
      </button>
      <button
        onClick={() => handleChange('en-US')}
        className={`px-4 py-2 rounded ${locale === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        English
      </button>
    </div>
  );
}
```

### 表单验证示例

```tsx
// packages/backend/src/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export function LoginForm() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">
          {t('user.username')}
        </label>
        <input type="text" className="mt-1 block w-full rounded border p-2" />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          {t('user.password')}
        </label>
        <input type="password" className="mt-1 block w-full rounded border p-2" />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {t('user.login')}
      </button>
    </form>
  );
}
```

## 添加新翻译

### 1. 扩展现有翻译

```typescript
// packages/backend/src/lib/i18n-custom.ts
import { getI18n } from '@lyricnote/shared';

// 添加业务特定的翻译
export function addCustomTranslations() {
  const i18n = getI18n();

  i18n.addResources('zh-CN', {
    lyrics: {
      title: '歌词',
      create: '创建歌词',
      edit: '编辑歌词',
      delete: '删除歌词',
    },
    notes: {
      title: '笔记',
      create: '创建笔记',
      edit: '编辑笔记',
    },
  });

  i18n.addResources('en-US', {
    lyrics: {
      title: 'Lyrics',
      create: 'Create Lyrics',
      edit: 'Edit Lyrics',
      delete: 'Delete Lyrics',
    },
    notes: {
      title: 'Notes',
      create: 'Create Note',
      edit: 'Edit Note',
    },
  });
}
```

### 2. 创建新的语言文件

如果需要支持更多语言（如繁体中文、日语），在 `packages/shared/src/i18n/locales/` 目录下创建新文件：

```typescript
// packages/shared/src/i18n/locales/zh-TW.ts
export default {
  common: {
    hello: '你好',
    welcome: '歡迎',
    // ...
  },
  // ...
} as const;
```

然后在 `packages/shared/src/i18n/index.ts` 中导出：

```typescript
export { default as zhTW } from './locales/zh-TW';
```

## API 参考

### useTranslation()

```typescript
const { t, locale, setLocale } = useTranslation();

// t: 翻译函数
t('common.hello')
t('validation.required', { context: { field: '用户名' } })
t('items', { count: 5 })

// locale: 当前语言
console.log(locale); // 'zh-CN'

// setLocale: 切换语言
setLocale('en-US')
```

### t() - 翻译函数

```typescript
import { t } from '@lyricnote/shared';

// 基础使用
t('common.hello')

// 插值
t('greeting', { context: { name: '张三' } })

// 复数
t('items', { count: 1 })
t('items', { count: 5 })

// 默认值
t('not.exist', { defaultValue: '默认值' })
```

## 最佳实践

1. **统一初始化**：在应用入口统一初始化 i18n
2. **懒加载**：按需加载不同语言包
3. **类型安全**：使用 TypeScript 确保翻译键的类型安全
4. **缓存语言**：使用平台适配器缓存用户的语言选择
5. **Fallback**：始终提供 fallback 语言

## 完整文档

查看 `packages/shared/src/i18n/README.md` 获取完整文档和高级用法。

