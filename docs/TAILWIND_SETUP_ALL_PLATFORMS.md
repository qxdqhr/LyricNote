# 全平台 Tailwind CSS 配置指南

本指南将帮助你在所有 4 个前端平台配置 Tailwind CSS，替代传统 CSS。

> ⚠️ **重要版本说明**
>
> - **Backend & Desktop**: 使用 **Tailwind CSS v4** (最新版本)
>   - 需要安装 `@tailwindcss/postcss`
>   - CSS 使用 `@import "tailwindcss"` 语法
> - **Mobile & MiniApp**: 使用基于 **Tailwind CSS v3** 的适配方案
>   - Mobile: NativeWind 3.x
>   - MiniApp: weapp-tailwindcss

## 📊 平台支持概览

| 平台                      | 方案              | Tailwind 版本 | 状态      | 难度     |
| ------------------------- | ----------------- | ------------- | --------- | -------- |
| **Backend (Next.js)**     | Tailwind CSS      | v4            | ✅ 已配置 | ⭐       |
| **Desktop (Electron)**    | Tailwind CSS      | v4            | ✅ 已配置 | ⭐⭐     |
| **Mobile (React Native)** | NativeWind        | v3            | 🔨 待配置 | ⭐⭐⭐   |
| **MiniApp (Taro)**        | weapp-tailwindcss | v3            | 🔨 待配置 | ⭐⭐⭐⭐ |

---

## 1️⃣ Backend (Next.js) ✅ 已完成

### 当前配置 (Tailwind v4)

```bash
# 已安装
packages/backend/
├── tailwind.config.ts     ✅
├── postcss.config.mjs     ✅ 使用 @tailwindcss/postcss
├── src/app/globals.css    ✅ 使用 @import "tailwindcss"
└── package.json           ✅ @tailwindcss/postcss, autoprefixer
```

### 语言切换器

✅ 已使用 Tailwind 版本：`LanguageSwitcherTailwind.tsx`

---

## 2️⃣ Desktop (Electron + Vite) ✅ 已完成

### 步骤 1: 安装依赖 (Tailwind v4)

```bash
cd packages/desktop
# v4 需要 @tailwindcss/postcss
pnpm add -D tailwindcss @tailwindcss/postcss autoprefixer
```

### 步骤 2: 配置 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B8AFF',
        secondary: '#FF6B9D',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
```

### 步骤 3: 配置 postcss.config.js (v4 语法)

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // v4 使用这个包
    autoprefixer: {},
  },
};
```

### 步骤 4: 创建 CSS 入口文件 (v4 语法)

```css
/* src/styles/index.css */
@import 'tailwindcss'; /* v4 使用 @import 而不是 @tailwind */

/* 自定义全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

### 步骤 5: 导入 CSS

```typescript
// src/main.tsx
import './styles/index.css';  // 导入 Tailwind CSS
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 步骤 7: 创建语言切换器

```typescript
// src/components/LanguageSwitcher.tsx
// 直接复制 Backend 的 LanguageSwitcherTailwind.tsx
```

---

## 3️⃣ Mobile (React Native) - NativeWind

### 什么是 NativeWind？

NativeWind 允许你在 React Native 中使用 Tailwind CSS 语法。

### 步骤 1: 安装依赖

```bash
cd packages/mobile
pnpm add nativewind
pnpm add -D tailwindcss
```

### 步骤 2: 初始化 Tailwind

```bash
npx tailwindcss init
```

### 步骤 3: 配置 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 步骤 4: 配置 Babel

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

### 步骤 5: TypeScript 配置（可选）

```typescript
// nativewind-env.d.ts
/// <reference types="nativewind/types" />
```

### 步骤 6: 创建语言切换器

```typescript
// src/components/LanguageSwitcher.tsx
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from '@lyricnote/shared';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <View className="flex-row gap-2 p-1 bg-gray-100 rounded-lg">
      <Pressable
        onPress={() => setLocale('zh-CN')}
        className={`px-4 py-2 rounded-md ${
          locale === 'zh-CN'
            ? 'bg-white shadow'
            : 'bg-transparent'
        }`}
      >
        <Text className="text-sm font-medium">🇨🇳 中文</Text>
      </Pressable>

      <Pressable
        onPress={() => setLocale('en-US')}
        className={`px-4 py-2 rounded-md ${
          locale === 'en-US'
            ? 'bg-white shadow'
            : 'bg-transparent'
        }`}
      >
        <Text className="text-sm font-medium">🇺🇸 English</Text>
      </Pressable>
    </View>
  );
}
```

### 限制和注意事项

⚠️ NativeWind 有一些限制：

1. **不支持所有 Tailwind 特性**
   - 不支持 `hover:`、`focus:` 等伪类
   - 不支持某些复杂选择器
   - 动画支持有限

2. **性能考虑**
   - 样式在运行时计算
   - 可能影响性能

3. **替代方案**
   - 对于复杂交互，使用 React Native 的 `StyleSheet`
   - 只在布局和简单样式使用 NativeWind

---

## 4️⃣ MiniApp (Taro) - weapp-tailwindcss

### 什么是 weapp-tailwindcss？

`weapp-tailwindcss` 是专为小程序设计的 Tailwind CSS 插件。

### 步骤 1: 安装依赖

```bash
cd packages/miniapp
pnpm add -D weapp-tailwindcss tailwindcss postcss autoprefixer
```

### 步骤 2: 初始化 Tailwind

```bash
npx tailwindcss init -p
```

### 步骤 3: 配置 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 小程序不需要重置样式
  },
};
```

### 步骤 4: 配置 postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-rem-to-responsive-pixel': {
      rootValue: 32, // 小程序基准值
      propList: ['*'],
      transformUnit: 'rpx', // 转换为 rpx
    },
  },
};
```

### 步骤 5: 配置 Taro config

```javascript
// config/index.ts
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';

const config = {
  // ...
  mini: {
    webpackChain(chain) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: 'taro',
              },
            ],
          },
        },
      });
    },
  },
  // ...
};
```

### 步骤 6: 创建全局样式

```css
/* src/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 步骤 7: 创建语言切换器

```tsx
// src/components/LanguageSwitcher/index.tsx
import { View, Text } from '@tarojs/components';
import { useTranslation } from '@lyricnote/shared';
import './index.scss'; // 如果需要额外样式

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <View className="flex flex-row gap-2 p-1 bg-gray-100 rounded-lg">
      <View
        onClick={() => setLocale('zh-CN')}
        className={`px-4 py-2 rounded ${
          locale === 'zh-CN' ? 'bg-white shadow' : 'bg-transparent'
        }`}
      >
        <Text className="text-sm font-medium">🇨🇳 中文</Text>
      </View>

      <View
        onClick={() => setLocale('en-US')}
        className={`px-4 py-2 rounded ${
          locale === 'en-US' ? 'bg-white shadow' : 'bg-transparent'
        }`}
      >
        <Text className="text-sm font-medium">🇺🇸 English</Text>
      </View>
    </View>
  );
}
```

### 限制和注意事项

⚠️ Taro + Tailwind 的限制：

1. **样式转换**
   - px 需要转换为 rpx
   - 某些 CSS 特性不支持

2. **文件大小**
   - 小程序有 2MB 限制
   - 需要使用 PurgeCSS 清理未使用的样式

3. **平台差异**
   - 不同小程序平台（微信、支付宝）可能有兼容性问题

---

## 🎯 统一的组件 API

无论哪个平台，都使用相同的 API：

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher variant="icon" />
```

---

## 📦 更新 Shared 包

### 移除 CSS 文件依赖

现在所有平台都使用 Tailwind，可以考虑：

#### 选项 1: 保留 CSS 作为备选（推荐）

```
packages/shared/src/i18n/
├── components/
│   ├── LanguageSwitcher.tsx    ← 保留
│   └── LanguageSwitcher.css    ← 保留（备选方案）
```

#### 选项 2: 完全移除 CSS

如果确定所有项目都用 Tailwind：

```bash
# 删除 CSS 文件
rm packages/shared/src/i18n/components/LanguageSwitcher.css

# 更新 package.json，移除 CSS 导出
```

---

## 🔧 配置脚本

创建一个一键配置脚本：

```bash
# scripts/setup-tailwind.sh
#!/bin/bash

echo "🎨 Setting up Tailwind CSS for all platforms..."

# Desktop
echo "📦 Configuring Desktop..."
cd packages/desktop
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Mobile
echo "📱 Configuring Mobile..."
cd ../mobile
pnpm add nativewind
pnpm add -D tailwindcss
npx tailwindcss init

# MiniApp
echo "🏪 Configuring MiniApp..."
cd ../miniapp
pnpm add -D weapp-tailwindcss tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "✅ Tailwind CSS setup complete for all platforms!"
```

---

## 📊 优势对比

### 使用 Tailwind CSS

| 优势             | 说明                       |
| ---------------- | -------------------------- |
| **统一性**       | 所有平台使用相同的样式语法 |
| **开发效率**     | 快速原型和迭代             |
| **类型安全**     | TypeScript 支持            |
| **Tree Shaking** | 自动移除未使用的样式       |
| **深色模式**     | 内置支持                   |
| **响应式**       | 简单的断点系统             |

### 传统 CSS

| 劣势         | 说明                   |
| ------------ | ---------------------- |
| **维护成本** | 多个 CSS 文件难以管理  |
| **样式冲突** | 全局命名空间           |
| **包体积**   | 所有样式都会打包       |
| **跨平台**   | 每个平台需要不同的 CSS |

---

## 🚀 迁移计划

### 阶段 1: Backend（已完成） ✅

- [x] 配置 Tailwind
- [x] 创建 Tailwind 版组件
- [x] 替换传统 CSS 版本

### 阶段 2: Desktop

- [ ] 配置 Tailwind
- [ ] 创建语言切换器
- [ ] 测试所有功能

### 阶段 3: Mobile

- [ ] 配置 NativeWind
- [ ] 创建语言切换器
- [ ] 性能测试

### 阶段 4: MiniApp

- [ ] 配置 weapp-tailwindcss
- [ ] 创建语言切换器
- [ ] 兼容性测试

### 阶段 5: 清理

- [ ] 移除传统 CSS 文件（可选）
- [ ] 更新文档
- [ ] 统一组件 API

---

## 📚 资源链接

- [Tailwind CSS 官网](https://tailwindcss.com/)
- [NativeWind 文档](https://www.nativewind.dev/)
- [weapp-tailwindcss GitHub](https://github.com/sonofmagic/weapp-tailwindcss)
- [Taro 官方文档](https://taro-docs.jd.com/)

---

## 💡 最佳实践

### 1. 样式一致性

创建共享的 Tailwind 配置：

```javascript
// packages/tailwind-config/index.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#5B8AFF',
        secondary: '#FF6B9D',
      },
    },
  },
};

// 各项目中
// tailwind.config.js
const sharedConfig = require('../tailwind-config');

module.exports = {
  ...sharedConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

### 2. 组件复用

在 shared 包中定义 Tailwind 类：

```typescript
// packages/shared/src/styles/classes.ts
export const buttonClasses = {
  primary: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600',
  secondary: 'px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300',
};
```

### 3. 深色模式

统一深色模式策略：

```typescript
// 所有平台使用相同的方法
<div className="bg-white dark:bg-gray-800">
```

---

## 🎯 总结

| 平台        | 推荐方案          | 配置难度 | 学习曲线 |
| ----------- | ----------------- | -------- | -------- |
| **Backend** | Tailwind CSS      | ⭐       | ⭐       |
| **Desktop** | Tailwind CSS      | ⭐⭐     | ⭐       |
| **Mobile**  | NativeWind        | ⭐⭐⭐   | ⭐⭐⭐   |
| **MiniApp** | weapp-tailwindcss | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**推荐优先级**：

1. ✅ Backend - 已完成
2. 🥈 Desktop - 简单，优先配置
3. 🥉 Mobile - 中等难度
4. ⚠️ MiniApp - 最复杂，最后配置

---

**最后更新**: 2025-10-26
