# i18n 使用示例大全

## 概述

本文档提供了 i18n 国际化系统的完整使用示例，涵盖所有常见场景。

## 目录

1. [基础使用](#基础使用)
2. [语言切换组件](#语言切换组件)
3. [替换旧的 constants](#替换旧的-constants)
4. [表单和验证](#表单和验证)
5. [动态内容](#动态内容)
6. [服务端渲染](#服务端渲染)
7. [移动端适配](#移动端适配)

---

## 基础使用

### 1. 初始化 i18n

在应用入口初始化一次：

```typescript
// packages/backend/src/app/layout.tsx
import { initI18n, zhCN, enUS, WebI18nAdapter } from '@lyricnote/shared';

// 初始化（只需要一次）
const adapter = new WebI18nAdapter();
const savedLocale = adapter.loadLocale();

initI18n({
  locale: savedLocale || 'zh-CN',
  fallbackLocale: 'zh-CN',
  resources: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### 2. 在组件中使用

```tsx
'use client';

import { useTranslation } from '@lyricnote/shared';

export function WelcomeMessage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('titles.welcome')}</h1>
      <p>{t('app.description')}</p>
    </div>
  );
}
```

---

## 语言切换组件

### 1. 导航栏中的语言切换

```tsx
// app/components/Navbar.tsx
'use client';

import { useTranslation } from '@lyricnote/shared';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-brand">
        <span>{t('app.icon')}</span>
        <h1>{t('app.name')}</h1>
      </div>

      {/* 菜单 */}
      <div className="nav-menu">
        <a href="/">{t('nav.home')}</a>
        <a href="/lyrics">{t('nav.lyrics')}</a>
        <a href="/profile">{t('nav.profile')}</a>
      </div>

      {/* 语言切换 */}
      <div className="nav-actions">
        <LanguageSwitcher variant="icon" />
      </div>
    </nav>
  );
}
```

### 2. 设置页面中的语言选择

```tsx
// app/settings/page.tsx
'use client';

import { useTranslation } from '@lyricnote/shared';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="settings-page">
      <h1>{t('nav.settings')}</h1>

      {/* 语言设置区域 */}
      <section className="settings-section">
        <h2>{t('language.label')}</h2>
        <p>选择您偏好的语言，设置会自动保存</p>
        
        <LanguageSwitcher variant="dropdown" />
      </section>

      {/* 其他设置... */}
    </div>
  );
}
```

### 3. 三种样式对比

```tsx
export function LanguageSwitcherShowcase() {
  return (
    <div className="showcase">
      {/* 按钮组样式 - 适合桌面端顶部导航 */}
      <div className="example">
        <h3>按钮组样式</h3>
        <LanguageSwitcher variant="buttons" />
      </div>

      {/* 下拉菜单样式 - 适合设置页面 */}
      <div className="example">
        <h3>下拉菜单样式</h3>
        <LanguageSwitcher variant="dropdown" />
      </div>

      {/* 图标按钮样式 - 适合移动端 */}
      <div className="example">
        <h3>图标按钮样式</h3>
        <LanguageSwitcher variant="icon" />
      </div>
    </div>
  );
}
```

---

## 替换旧的 constants

### 之前：使用 constants

```tsx
// ❌ 旧方式
import { APP_CONFIG, UI_TEXT, APP_TITLES } from '@lyricnote/shared';

export function OldComponent() {
  return (
    <div>
      <h1>{APP_TITLES.welcome}</h1>
      <p>{APP_CONFIG.description}</p>
      <button>{UI_TEXT.buttons.login}</button>
      <p>{UI_TEXT.status.loading}</p>
    </div>
  );
}
```

### 之后：使用 i18n

```tsx
// ✅ 新方式
import { useTranslation } from '@lyricnote/shared';

export function NewComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('titles.welcome')}</h1>
      <p>{t('app.description')}</p>
      <button>{t('user.login')}</button>
      <p>{t('status.loading')}</p>
    </div>
  );
}
```

### 完整的替换映射表

| 旧的 constants | 新的 i18n 键 |
|----------------|--------------|
| `APP_CONFIG.name` | `app.name` |
| `APP_CONFIG.fullName` | `app.fullName` |
| `APP_CONFIG.description` | `app.description` |
| `APP_TITLES.main` | `titles.main` |
| `APP_TITLES.welcome` | `titles.welcome` |
| `UI_TEXT.buttons.login` | `user.login` |
| `UI_TEXT.buttons.logout` | `nav.logout` |
| `UI_TEXT.navigation.home` | `nav.home` |
| `UI_TEXT.navigation.profile` | `nav.profile` |
| `UI_TEXT.status.loading` | `status.loading` |
| `UI_TEXT.status.success` | `status.success` |

---

## 表单和验证

### 登录表单

```tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '@lyricnote/shared';

export function LoginForm() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const newErrors = {};

    // 用户名验证
    if (!values.username) {
      newErrors.username = t('validation.required', {
        context: { field: t('user.username') },
      });
    }

    // 密码验证
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
    <form className="login-form">
      {/* 用户名 */}
      <div className="form-group">
        <label>{t('user.username')}</label>
        <input type="text" placeholder={t('user.username')} />
        {errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>

      {/* 密码 */}
      <div className="form-group">
        <label>{t('user.password')}</label>
        <input type="password" placeholder={t('user.password')} />
        {errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      {/* 按钮 */}
      <button type="submit">{t('user.login')}</button>
      <button type="button">{t('common.cancel')}</button>
    </form>
  );
}
```

### 通用表单验证函数

```typescript
import { t } from '@lyricnote/shared';

// 通用验证函数
export const validators = {
  required: (value: any, fieldName: string) => {
    if (!value) {
      return t('validation.required', { context: { field: fieldName } });
    }
    return null;
  },

  email: (value: string) => {
    if (!/\S+@\S+\.\S+/.test(value)) {
      return t('validation.invalid_email');
    }
    return null;
  },

  minLength: (value: string, min: number) => {
    if (value.length < min) {
      return t('validation.password_too_short', { context: { count: min } });
    }
    return null;
  },
};

// 使用
const error = validators.required(username, t('user.username'));
```

---

## 动态内容

### Toast 消息

```tsx
import { t } from '@lyricnote/shared';
import { toast } from 'react-hot-toast';

// 保存数据
async function saveData(data) {
  try {
    toast.loading(t('status.loading'));
    
    await api.save(data);
    
    toast.success(t('success.saved'));
  } catch (error) {
    toast.error(t('errors.network'));
  }
}

// 删除数据
async function deleteData(id) {
  try {
    await api.delete(id);
    toast.success(t('success.deleted'));
  } catch (error) {
    toast.error(t('errors.server'));
  }
}
```

### 确认对话框

```tsx
import { t } from '@lyricnote/shared';

function ConfirmDialog({ onConfirm, onCancel }) {
  const message = t('common.confirm');
  
  return (
    <div className="dialog">
      <p>{message}</p>
      <button onClick={onConfirm}>{t('common.confirm')}</button>
      <button onClick={onCancel}>{t('common.cancel')}</button>
    </div>
  );
}
```

---

## 服务端渲染

### Next.js App Router

```tsx
// app/page.tsx
import { Metadata } from 'next';
import { t } from '@lyricnote/shared';

// 元数据
export const metadata: Metadata = {
  title: t('pages.home.title'),
  description: t('pages.home.description'),
};

// 服务端组件
export default function HomePage() {
  return (
    <div>
      <h1>{t('titles.welcome')}</h1>
      <ClientComponent />
    </div>
  );
}

// 客户端组件
'use client';
function ClientComponent() {
  const { t } = useTranslation();
  return <p>{t('app.description')}</p>;
}
```

---

## 移动端适配

### React Native

```tsx
// packages/mobile/src/screens/HomeScreen.tsx
import { useTranslation } from '@lyricnote/shared';
import { View, Text, Button } from 'react-native';

export function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('titles.welcome')}</Text>
      <Text style={styles.description}>{t('app.description')}</Text>
      <Button title={t('common.next')} onPress={handleNext} />
    </View>
  );
}
```

### Taro 小程序

```tsx
// packages/miniapp/src/pages/index/index.tsx
import { useTranslation } from '@lyricnote/shared';
import { View, Text, Button } from '@tarojs/components';

export default function Index() {
  const { t } = useTranslation();

  return (
    <View className="index">
      <Text>{t('titles.welcome')}</Text>
      <Text>{t('app.description')}</Text>
      <Button>{t('user.login')}</Button>
    </View>
  );
}
```

---

## 完整示例：用户中心页面

```tsx
'use client';

import { useTranslation } from '@lyricnote/shared';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useState } from 'react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [user, setUser] = useState({
    username: 'user123',
    email: 'user@example.com',
  });

  return (
    <div className="profile-page">
      {/* 页面标题 */}
      <div className="page-header">
        <h1>{t('pages.profile.title')}</h1>
        <p>{t('pages.profile.description')}</p>
      </div>

      {/* 用户信息卡片 */}
      <div className="profile-card">
        <h2>{t('user.username')}</h2>
        <p>{user.username}</p>

        <h2>{t('user.email')}</h2>
        <p>{user.email}</p>

        <div className="actions">
          <button>{t('common.edit')}</button>
          <button>{t('common.save')}</button>
        </div>
      </div>

      {/* 语言设置 */}
      <div className="settings-card">
        <h2>{t('language.label')}</h2>
        <LanguageSwitcher variant="dropdown" />
      </div>

      {/* 退出登录 */}
      <div className="logout-section">
        <button className="logout-button">
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );
}
```

---

## 实用技巧

### 1. 创建翻译辅助函数

```typescript
// utils/i18n-helpers.ts
import { t } from '@lyricnote/shared';

// 获取错误消息
export function getErrorMessage(error: any): string {
  if (error.response?.status === 401) {
    return t('errors.unauthorized');
  }
  if (error.response?.status === 404) {
    return t('errors.not_found');
  }
  if (error.message.includes('network')) {
    return t('errors.network');
  }
  return t('errors.unknown');
}

// 获取成功消息
export function getSuccessMessage(action: string): string {
  const actionMap = {
    save: t('success.saved'),
    delete: t('success.deleted'),
    update: t('success.updated'),
    create: t('success.created'),
  };
  return actionMap[action] || t('common.success');
}
```

### 2. 统一的按钮组件

```tsx
import { useTranslation } from '@lyricnote/shared';

type ButtonType = 'submit' | 'cancel' | 'save' | 'delete' | 'edit';

export function I18nButton({ type, ...props }: { type: ButtonType }) {
  const { t } = useTranslation();

  const labelMap = {
    submit: t('common.submit'),
    cancel: t('common.cancel'),
    save: t('common.save'),
    delete: t('common.delete'),
    edit: t('common.edit'),
  };

  return <button {...props}>{labelMap[type]}</button>;
}
```

---

## 测试

### 单元测试

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTranslation, initI18n, zhCN, enUS } from '@lyricnote/shared';

describe('i18n', () => {
  beforeAll(() => {
    initI18n({
      locale: 'zh-CN',
      fallbackLocale: 'zh-CN',
      resources: { 'zh-CN': zhCN, 'en-US': enUS },
    });
  });

  it('should translate correctly', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('app.name')).toBe('LyricNote');
  });

  it('should switch language', () => {
    const { result } = renderHook(() => useTranslation());
    
    act(() => {
      result.current.setLocale('en-US');
    });
    
    expect(result.current.t('user.login')).toBe('Login');
  });
});
```

---

## 总结

通过这些示例，你应该能够：

1. ✅ 在任何组件中使用 i18n
2. ✅ 添加语言切换功能
3. ✅ 替换旧的硬编码文案
4. ✅ 处理表单验证
5. ✅ 适配不同平台

现在开始使用 i18n 让你的应用国际化吧！🚀

