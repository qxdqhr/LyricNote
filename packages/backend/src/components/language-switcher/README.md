# 语言切换组件使用指南

## 概述

`LanguageSwitcher` 组件提供了三种样式的语言切换功能，支持多语言国际化。

## 使用方法

### 1. 基础使用（按钮组样式）

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Header() {
  return (
    <header>
      <nav>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

### 2. 下拉菜单样式

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Settings() {
  return (
    <div className="settings">
      <LanguageSwitcher variant="dropdown" />
    </div>
  );
}
```

### 3. 图标按钮样式

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Toolbar() {
  return (
    <div className="toolbar">
      <LanguageSwitcher variant="icon" />
    </div>
  );
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'buttons' \| 'dropdown' \| 'icon'` | `'buttons'` | 语言切换器样式 |
| `className` | `string` | `''` | 自定义 CSS 类名 |

## 样式

组件已内置完整样式，包括：
- 浅色/深色主题自适应
- 响应式设计（移动端优化）
- 悬停/激活状态
- 平滑动画过渡

### 自定义样式

```tsx
<LanguageSwitcher
  variant="buttons"
  className="my-custom-switcher"
/>
```

```css
/* 你的自定义样式 */
.my-custom-switcher {
  position: fixed;
  top: 1rem;
  right: 1rem;
}
```

## 完整示例

### 在导航栏中使用

```tsx
// app/components/Navbar.tsx
'use client';

import { useTranslation } from '@lyricnote/shared';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>{t('app.name')}</h1>
      </div>

      <div className="nav-menu">
        <a href="/">{t('nav.home')}</a>
        <a href="/profile">{t('nav.profile')}</a>
        <a href="/settings">{t('nav.settings')}</a>
      </div>

      <div className="nav-actions">
        <LanguageSwitcher variant="icon" />
      </div>
    </nav>
  );
}
```

### 在设置页面中使用

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

      <section className="settings-section">
        <h2>{t('language.label')}</h2>
        <p>选择您偏好的语言</p>
        <LanguageSwitcher variant="dropdown" />
      </section>
    </div>
  );
}
```

### 在移动端使用

```tsx
// app/components/MobileNav.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '@lyricnote/shared';
import { LanguageSwitcher } from '@/components/language-switcher';

export function MobileNav() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {isOpen && (
        <div className="mobile-menu">
          <a href="/">{t('nav.home')}</a>
          <a href="/profile">{t('nav.profile')}</a>

          <div className="mobile-language">
            <LanguageSwitcher variant="buttons" />
          </div>
        </div>
      )}
    </div>
  );
}
```

## 响应式设计

组件在移动端会自动调整：

- **桌面端**：显示完整的语言名称和国旗
- **移动端**：只显示国旗图标，节省空间

```css
/* 自动响应式，无需额外配置 */
@media (max-width: 768px) {
  /* 按钮组样式：只显示国旗 */
  .language-button .label {
    display: none;
  }
}
```

## 主题支持

组件支持浅色和深色主题：

```css
/* 自动跟随系统主题 */
@media (prefers-color-scheme: dark) {
  /* 深色主题样式自动应用 */
}
```

## 最佳实践

### 1. 放在固定位置

```tsx
// 推荐：放在导航栏右上角
<nav>
  <Logo />
  <Menu />
  <div className="nav-right">
    <UserMenu />
    <LanguageSwitcher variant="icon" />
  </div>
</nav>
```

### 2. 在设置页面提供详细选项

```tsx
// 设置页面使用下拉菜单样式
<section className="language-settings">
  <h3>语言设置</h3>
  <LanguageSwitcher variant="dropdown" />
</section>
```

### 3. 移动端使用简洁样式

```tsx
// 移动端使用图标按钮
<MobileHeader>
  <LanguageSwitcher variant="icon" />
</MobileHeader>
```

## 测试

### 单元测试

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '@/components/language-switcher';

describe('LanguageSwitcher', () => {
  it('should render language options', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByText('简体中文')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should switch language on click', () => {
    render(<LanguageSwitcher />);

    const englishButton = screen.getByText('English');
    fireEvent.click(englishButton);

    // 验证语言已切换
  });
});
```

### E2E 测试

```tsx
describe('Language switching', () => {
  it('should persist language preference', () => {
    cy.visit('/');

    // 切换到英文
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains('English').click();

    // 刷新页面
    cy.reload();

    // 验证语言保持
    cy.contains('Login').should('exist');
  });
});
```

## 常见问题

### Q: 如何添加新语言？

A: 在 `packages/shared/src/i18n/locales/` 中添加新的语言文件。

### Q: 如何自定义语言选项？

A: 修改 `LanguageSwitcher.tsx` 中的 `LANGUAGE_OPTIONS` 数组。

### Q: 如何保存用户的语言选择？

A: 组件会自动保存到 localStorage，也可以通过 `onLanguageChange` 回调保存到服务器。

### Q: 如何在服务端渲染中使用？

A: 组件标记为 `'use client'`，可以在客户端组件中直接使用。

## 相关文档

- [i18n 快速入门](../../../docs/I18N_QUICK_START.md)
- [i18n 迁移指南](../../../docs/I18N_MIGRATION_GUIDE.md)
- [i18n 方案对比](../../../docs/I18N_COMPARISON.md)

