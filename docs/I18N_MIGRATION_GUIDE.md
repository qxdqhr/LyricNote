# i18n 迁移指南

## 概述

本指南将帮助你把现有的硬编码文案迁移到 i18n 国际化系统。

## 迁移前后对比

### 之前：硬编码文案

```typescript
// ❌ 旧方式：硬编码
const APP_CONFIG = {
  name: '通用标题1',
  fullName: '通用全称',
  description: '通用描述',
};

const UI_TEXT = {
  buttons: {
    login: '登录',
    logout: '退出登录',
  },
};

// 使用
function Component() {
  return <h1>{APP_CONFIG.name}</h1>;
}
```

### 之后：使用 i18n

```typescript
// ✅ 新方式：i18n
import { useTranslation } from '@lyricnote/shared';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('app.name')}</h1>;
}
```

## 迁移步骤

### 步骤 1：识别需要国际化的文案

搜索项目中的硬编码文案：

```bash
# 搜索常量文件
grep -r "通用" packages/
grep -r "title.*:" packages/ | grep -v node_modules
```

### 步骤 2：添加翻译键

在 `packages/shared/src/i18n/locales/zh-CN.ts` 和 `en-US.ts` 中添加对应的翻译：

```typescript
// zh-CN.ts
export default {
  app: {
    name: 'LyricNote',              // 替换 '通用标题1'
    fullName: 'LyricNote - 歌词笔记',  // 替换 '通用全称'
    description: '...',              // 替换 '通用描述'
  },
  // ...
};
```

### 步骤 3：替换组件中的硬编码文案

#### React 组件

```tsx
// ❌ 之前
import { APP_CONFIG, UI_TEXT } from '@lyricnote/shared';

function LoginButton() {
  return <button>{UI_TEXT.buttons.login}</button>;
}

// ✅ 之后
import { useTranslation } from '@lyricnote/shared';

function LoginButton() {
  const { t } = useTranslation();
  return <button>{t('user.login')}</button>;
}
```

#### 非 React 代码

```typescript
// ❌ 之前
import { UI_TEXT } from '@lyricnote/shared';

function showMessage() {
  alert(UI_TEXT.status.success);
}

// ✅ 之后
import { t } from '@lyricnote/shared';

function showMessage() {
  alert(t('status.success'));
}
```

### 步骤 4：处理动态内容

```typescript
// ❌ 之前
const message = `欢迎使用 ${APP_CONFIG.name}`;

// ✅ 之后
const message = t('titles.welcome'); // "欢迎使用 LyricNote"
```

### 步骤 5：处理插值

```typescript
// ❌ 之前
const error = `${fieldName}不能为空`;

// ✅ 之后
const error = t('validation.required', { context: { field: fieldName } });
```

## 常见场景迁移

### 1. 页面标题

```tsx
// ❌ 之前
import { APP_TITLES } from '@lyricnote/shared';

export default function HomePage() {
  return (
    <>
      <title>{APP_TITLES.main}</title>
      <h1>{APP_TITLES.welcome}</h1>
    </>
  );
}

// ✅ 之后
import { useTranslation } from '@lyricnote/shared';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <title>{t('titles.main')}</title>
      <h1>{t('titles.welcome')}</h1>
    </>
  );
}
```

### 2. 导航菜单

```tsx
// ❌ 之前
import { UI_TEXT } from '@lyricnote/shared';

const menuItems = [
  { key: 'home', label: UI_TEXT.navigation.home },
  { key: 'profile', label: UI_TEXT.navigation.profile },
];

// ✅ 之后
import { useTranslation } from '@lyricnote/shared';

function Navigation() {
  const { t } = useTranslation();

  const menuItems = [
    { key: 'home', label: t('nav.home') },
    { key: 'profile', label: t('nav.profile') },
  ];

  return (/* ... */);
}
```

### 3. 表单验证

```tsx
// ❌ 之前
import { UI_TEXT } from '@lyricnote/shared';

const validateForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = UI_TEXT.form.required;
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = UI_TEXT.form.emailInvalid;
  }

  return errors;
};

// ✅ 之后
import { t } from '@lyricnote/shared';

const validateForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = t('validation.required', {
      context: { field: t('user.email') }
    });
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = t('validation.invalid_email');
  }

  return errors;
};
```

### 4. Toast/Notification 消息

```tsx
// ❌ 之前
import { UI_TEXT } from '@lyricnote/shared';

function saveData() {
  try {
    // save...
    toast.success(UI_TEXT.status.success);
  } catch (error) {
    toast.error(UI_TEXT.status.error);
  }
}

// ✅ 之后
import { t } from '@lyricnote/shared';

function saveData() {
  try {
    // save...
    toast.success(t('success.saved'));
  } catch (error) {
    toast.error(t('errors.unknown'));
  }
}
```

## 翻译键命名规范

遵循以下命名规范：

```typescript
// ✅ 好的命名
t('app.name')              // 应用相关
t('nav.home')              // 导航相关
t('user.login')            // 用户相关
t('validation.required')   // 验证相关
t('errors.network')        // 错误相关
t('success.saved')         // 成功消息

// ❌ 避免的命名
t('appName')               // 不够明确
t('home')                  // 缺少命名空间
t('loginButton')           // 过于具体
```

## 迁移检查清单

- [ ] 识别所有硬编码文案
- [ ] 在 i18n 文件中添加对应翻译
- [ ] 替换 React 组件中的文案
- [ ] 替换非 React 代码中的文案
- [ ] 处理动态内容和插值
- [ ] 测试所有语言切换
- [ ] 检查移动端显示
- [ ] 更新文档

## 渐进式迁移策略

你可以逐步迁移，无需一次性完成：

### 第 1 阶段：核心功能
- ✅ 导航菜单
- ✅ 按钮文案
- ✅ 错误/成功消息

### 第 2 阶段：表单和验证
- ⏳ 表单标签
- ⏳ 验证消息
- ⏳ 占位符文本

### 第 3 阶段：页面内容
- ⏳ 页面标题
- ⏳ 描述文本
- ⏳ 帮助文档

## 常见问题

### Q1: 旧的 constants 文件需要删除吗？

A: 不需要立即删除。可以保留非文案类的配置（如 API_CONFIG、THEME_CONFIG 等），只迁移文案部分。

### Q2: 如何保持类型安全？

A: 使用 TypeScript 的 `as const` 和类型推导：

```typescript
const translations = {
  hello: '你好'
} as const;

type TranslationKeys = keyof typeof translations;
```

### Q3: 如何处理 SEO？

A: 使用 Next.js 的元数据 API：

```tsx
export async function generateMetadata({ params }) {
  const { locale } = params;

  return {
    title: t('pages.home.title'),
    description: t('pages.home.description'),
  };
}
```

### Q4: 动态导入翻译文件

如果翻译文件很大，可以按需加载：

```typescript
async function loadTranslation(locale: Locale) {
  const translations = await import(`./locales/${locale}.ts`);
  getI18n().addResources(locale, translations.default);
}
```

## 测试迁移

### 单元测试

```typescript
import { renderHook } from '@testing-library/react';
import { useTranslation, initI18n, zhCN, enUS } from '@lyricnote/shared';

describe('i18n migration', () => {
  beforeAll(() => {
    initI18n({
      locale: 'zh-CN',
      fallbackLocale: 'zh-CN',
      resources: {
        'zh-CN': zhCN,
        'en-US': enUS,
      },
    });
  });

  it('should translate correctly', () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.t('app.name')).toBe('LyricNote');
    expect(result.current.t('user.login')).toBe('登录');
  });

  it('should switch language', () => {
    const { result } = renderHook(() => useTranslation());

    result.current.setLocale('en-US');

    expect(result.current.t('user.login')).toBe('Login');
  });
});
```

### E2E 测试

```typescript
describe('Language switching', () => {
  it('should switch language correctly', () => {
    cy.visit('/');

    // 默认中文
    cy.contains('登录');

    // 切换到英文
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains('English').click();
    cy.contains('Login');
  });
});
```

## 总结

迁移到 i18n 系统的好处：

1. ✅ **国际化支持**：轻松支持多语言
2. ✅ **维护性**：集中管理所有文案
3. ✅ **可扩展性**：方便添加新语言
4. ✅ **类型安全**：TypeScript 支持
5. ✅ **用户体验**：用户可以选择喜欢的语言

现在就开始迁移吧！🚀

