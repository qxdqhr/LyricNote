# i18n 导入指南

## 问题说明

为了避免打包工具（如 Next.js/Webpack）尝试解析不同平台的依赖（如 React Native、Taro），我们将平台适配器从主导出中移除。

### 之前的问题

```typescript
// ❌ 这会导致 Next.js 尝试解析 React Native
import { WebI18nAdapter, ReactNativeI18nAdapter } from '@lyricnote/shared';
```

**错误信息**：
```
Error: × Expected 'from', got 'typeOf'
import typeof * as ReactNativePublicAPI from './index.js.flow';
```

### 解决方案

不同平台使用不同的导入路径。

---

## 正确的导入方式

### 1. Web 平台 (Next.js, React Web)

```typescript
// ✅ 核心功能从主包导入
import { initI18n, useTranslation, zhCN, enUS } from '@lyricnote/shared';

// ✅ Web 适配器从 i18n/web 导入
import { WebI18nAdapter, ElectronI18nAdapter } from '@lyricnote/shared/i18n/web';
```

**示例**：

```typescript
// packages/backend/src/lib/i18n.ts
import { initI18n, zhCN, enUS } from '@lyricnote/shared';
import { WebI18nAdapter } from '@lyricnote/shared/i18n/web';

export async function initializeI18n() {
  const adapter = new WebI18nAdapter();
  const locale = await adapter.loadLocale() || 'zh-CN';
  
  initI18n({
    locale,
    fallbackLocale: 'zh-CN',
    resources: { 'zh-CN': zhCN, 'en-US': enUS },
  });
}
```

---

### 2. React Native 平台

```typescript
// ✅ 核心功能从主包导入
import { initI18n, useTranslation, zhCN, enUS } from '@lyricnote/shared';

// ✅ React Native 适配器从 dist 导入
import { ReactNativeI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters';
```

**示例**：

```typescript
// packages/mobile/src/lib/i18n.ts
import { initI18n, zhCN, enUS } from '@lyricnote/shared';
import { ReactNativeI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters';

export async function initializeI18n() {
  const adapter = new ReactNativeI18nAdapter();
  const locale = await adapter.loadLocale() || adapter.getSystemLocale();
  
  initI18n({
    locale,
    fallbackLocale: 'zh-CN',
    resources: { 'zh-CN': zhCN, 'en-US': enUS },
  });
}
```

---

### 3. Taro 小程序平台

```typescript
// ✅ 核心功能从主包导入
import { initI18n, useTranslation, zhCN, enUS } from '@lyricnote/shared';

// ✅ Taro 适配器从 dist 导入
import { TaroI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters';
```

**示例**：

```typescript
// packages/miniapp/src/lib/i18n.ts
import { initI18n, zhCN, enUS } from '@lyricnote/shared';
import { TaroI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters';

export async function initializeI18n() {
  const adapter = new TaroI18nAdapter();
  const locale = await adapter.loadLocale() || adapter.getSystemLocale();
  
  initI18n({
    locale,
    fallbackLocale: 'zh-CN',
    resources: { 'zh-CN': zhCN, 'en-US': enUS },
  });
}
```

---

### 4. Electron 桌面平台

```typescript
// ✅ 核心功能从主包导入
import { initI18n, useTranslation, zhCN, enUS } from '@lyricnote/shared';

// ✅ Electron 适配器从 i18n/web 导入（Electron 基于 Web 技术）
import { ElectronI18nAdapter } from '@lyricnote/shared/i18n/web';
```

**示例**：

```typescript
// packages/desktop/src/lib/i18n.ts
import { initI18n, zhCN, enUS } from '@lyricnote/shared';
import { ElectronI18nAdapter } from '@lyricnote/shared/i18n/web';

export async function initializeI18n() {
  const adapter = new ElectronI18nAdapter();
  const locale = await adapter.loadLocale() || adapter.getSystemLocale();
  
  initI18n({
    locale,
    fallbackLocale: 'zh-CN',
    resources: { 'zh-CN': zhCN, 'en-US': enUS },
  });
}
```

---

## 导入路径总结

| 平台 | 适配器 | 导入路径 |
|------|--------|----------|
| **Web (Next.js)** | `WebI18nAdapter` | `@lyricnote/shared/i18n/web` |
| **Electron** | `ElectronI18nAdapter` | `@lyricnote/shared/i18n/web` |
| **React Native** | `ReactNativeI18nAdapter` | `@lyricnote/shared/dist/i18n/adapters` |
| **Taro 小程序** | `TaroI18nAdapter` | `@lyricnote/shared/dist/i18n/adapters` |

---

## 常见错误和解决方案

### 错误 1：Cannot find module '@lyricnote/shared/i18n/web'

**原因**：shared 包未构建或未安装。

**解决**：

```bash
cd packages/shared
pnpm build
```

---

### 错误 2：Expected 'from', got 'typeOf'

**原因**：从主包导入了平台适配器，导致 Next.js 尝试解析 React Native。

**解决**：

```typescript
// ❌ 错误
import { WebI18nAdapter } from '@lyricnote/shared';

// ✅ 正确
import { WebI18nAdapter } from '@lyricnote/shared/i18n/web';
```

---

### 错误 3：Module not found: Can't resolve 'react-native'

**原因**：在 Web 环境中导入了 React Native 适配器。

**解决**：确保只在对应平台导入对应的适配器。

---

## 为什么这样设计？

### 问题根源

不同平台的适配器依赖不同的平台 API：

- `WebI18nAdapter` → 依赖 `window`、`localStorage`
- `ReactNativeI18nAdapter` → 依赖 `react-native`
- `TaroI18nAdapter` → 依赖 `@tarojs/taro`
- `ElectronI18nAdapter` → 依赖 `electron`（但可以用 Web API）

### 传统方案的问题

如果所有适配器都从主入口导出：

```typescript
// shared/src/index.ts
export { WebI18nAdapter, ReactNativeI18nAdapter } from './i18n/adapters';
```

打包工具（Webpack、Vite 等）会尝试解析所有导入的模块，即使你只用到 `WebI18nAdapter`，它也会尝试解析 `react-native`，导致：

1. **打包失败**：Next.js 无法解析 React Native 的 Flow 语法
2. **包体积增大**：引入不需要的依赖
3. **类型错误**：TypeScript 找不到平台特定的类型

### 我们的解决方案

**分离导出路径**：

- `@lyricnote/shared` - 核心功能（i18n、hooks、组件）
- `@lyricnote/shared/i18n/web` - Web 平台适配器
- `@lyricnote/shared/dist/i18n/adapters` - 所有平台适配器（需要时显式导入）

**优点**：

1. ✅ 避免打包工具解析不需要的依赖
2. ✅ 更好的 Tree Shaking
3. ✅ 类型安全
4. ✅ 明确的平台分离

---

## 最佳实践

### 1. 创建平台专用的 i18n 模块

每个平台创建自己的 `lib/i18n.ts` 文件：

```
packages/
├── backend/src/lib/i18n.ts      # Web 平台
├── mobile/src/lib/i18n.ts       # React Native 平台
├── miniapp/src/lib/i18n.ts      # Taro 平台
└── desktop/src/lib/i18n.ts      # Electron 平台
```

### 2. 统一的接口

虽然导入路径不同，但所有平台使用相同的接口：

```typescript
// 在所有平台中
import { useTranslation } from '@lyricnote/shared';

function Component() {
  const { t } = useTranslation();
  return <div>{t('app.name')}</div>;
}
```

### 3. 按需导入

只导入当前平台需要的适配器：

```typescript
// Next.js - 只导入 Web 适配器
import { WebI18nAdapter } from '@lyricnote/shared/i18n/web';

// React Native - 只导入 RN 适配器
import { ReactNativeI18nAdapter } from '@lyricnote/shared/dist/i18n/adapters';
```

---

## 相关文档

- [i18n 快速入门](./I18N_QUICK_START.md)
- [i18n 迁移指南](./I18N_MIGRATION_GUIDE.md)
- [i18n 使用示例](./I18N_USAGE_EXAMPLES.md)

---

## 常见问题

### Q: 为什么不用条件导入？

**A**: 条件导入（如 `try-catch`）在编译时无效，打包工具仍会尝试解析所有模块。

### Q: 可以在同一个项目中使用多个适配器吗？

**A**: 技术上可以，但不推荐。每个平台应该只使用自己的适配器。

### Q: 如何添加新的平台？

**A**: 在 `shared/src/i18n/adapters.ts` 中创建新的适配器类，然后在该平台的项目中从 `dist/i18n/adapters` 导入。

---

**最后更新**: 2025-10-26

