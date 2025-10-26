# 语言切换器组件

## 📦 两个版本

| 版本 | 文件 | 样式 | 推荐 |
|------|------|------|------|
| **Tailwind** | `LanguageSwitcherTailwind.tsx` | Tailwind CSS | ✅ **推荐** |
| **CSS** | `LanguageSwitcherWrapper.tsx` | 独立 CSS 文件 | ⚠️ 备选 |

---

## 🎯 快速使用

### 推荐方式（Tailwind）

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

// 自动使用 Tailwind 版本
<LanguageSwitcher variant="icon" />
```

**特点**：
- ✅ 与项目风格一致
- ✅ 自动深色模式
- ✅ 响应式设计
- ✅ 更小的打包体积
- ✅ 更好的开发体验

---

## 📂 文件说明

### 1. `LanguageSwitcherTailwind.tsx` ⭐ 默认

**样式方案**：Tailwind CSS 内联样式

**优点**：
- 与 Next.js 项目集成
- 自动支持深色模式
- 响应式开箱即用
- 打包体积更小

**使用**：
```tsx
import { LanguageSwitcher } from '@/components/language-switcher';
```

---

### 2. `LanguageSwitcherWrapper.tsx` 备选

**样式方案**：导入独立 CSS 文件

**CSS 文件位置**：
```
packages/shared/src/i18n/components/LanguageSwitcher.css
```

**优点**：
- 完全独立的样式
- 不依赖 Tailwind
- 跨框架兼容

**缺点**：
- 打包体积更大
- 需要额外导入 CSS
- 与项目风格不一致

**使用**：
```tsx
import { LanguageSwitcherWrapper } from '@/components/language-switcher';
```

---

## 🎨 关于 CSS 文件

### CSS 文件在哪里？

CSS 文件 **不在** Backend 项目中，而是在 `shared` 包中：

```
packages/
├── shared/
│   └── src/
│       └── i18n/
│           └── components/
│               └── LanguageSwitcher.css  ← CSS 文件在这里
└── backend/
    └── src/
        └── components/
            └── language-switcher/
                ├── LanguageSwitcherTailwind.tsx  ← 默认使用这个
                └── LanguageSwitcherWrapper.tsx   ← 会导入 shared 的 CSS
```

### 为什么保留 CSS 文件？

1. **兼容性**：其他非 Tailwind 项目可能需要
2. **共享包**：`shared` 包需要提供通用组件
3. **备选方案**：某些场景可能需要独立样式

### Backend 项目需要关心 CSS 吗？

**不需要！** ❌

- ✅ 默认使用 Tailwind 版本
- ✅ 不需要手动导入 CSS
- ✅ 不需要管理 CSS 文件
- ✅ CSS 文件由 `shared` 包管理

**除非**你明确要使用 CSS 版本（`LanguageSwitcherWrapper`），否则完全忽略 CSS 文件。

---

## 🔄 如何切换版本？

### 当前默认（Tailwind）

```tsx
// index.ts
export { LanguageSwitcher } from './LanguageSwitcherTailwind';  // 默认
```

### 如果想使用 CSS 版本

```tsx
// 在你的组件中
import { LanguageSwitcherWrapper as LanguageSwitcher } from '@/components/language-switcher';
```

---

## 📊 对比

| 特性 | Tailwind 版本 | CSS 版本 |
|------|---------------|----------|
| **文件大小** | ~3KB | ~8KB |
| **依赖** | Tailwind CSS | 独立 CSS 文件 |
| **深色模式** | `dark:` 自动 | `@media` 手动 |
| **响应式** | `sm:` `md:` | `@media` 手动 |
| **与项目一致** | ✅ | ❌ |
| **开发体验** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **维护成本** | 低 | 中 |
| **跨框架** | ❌ | ✅ |

---

## 🧹 清理建议

### Backend 项目

**保留**：
- ✅ `LanguageSwitcherTailwind.tsx`
- ✅ `index.ts`

**可选保留**（如果需要备选方案）：
- ⚠️ `LanguageSwitcherWrapper.tsx`

**不需要关心**：
- ❌ `LanguageSwitcher.css`（在 shared 包中）

### Shared 包

**保留所有**：
- ✅ `components/LanguageSwitcher.tsx`
- ✅ `components/LanguageSwitcher.css`
- ✅ `adapters/web.ts`

**原因**：shared 包需要提供通用组件给所有项目使用。

---

## 💡 最佳实践

### 1. Backend 项目

```tsx
// ✅ 推荐
import { LanguageSwitcher } from '@/components/language-switcher';
<LanguageSwitcher variant="icon" />
```

### 2. 自定义样式

```tsx
// ✅ Tailwind 版本容易自定义
<LanguageSwitcher
  variant="icon"
  className="shadow-lg border-2 border-blue-500"
/>
```

### 3. 响应式布局

```tsx
// ✅ 桌面端和移动端自动适配
<div className="hidden md:block">
  <LanguageSwitcher variant="buttons" />
</div>
<div className="md:hidden">
  <LanguageSwitcher variant="icon" />
</div>
```

---

## 📚 相关文档

- [样式方案对比](./STYLING_COMPARISON.md) - 详细的两种方案对比
- [i18n 快速入门](/docs/I18N_QUICK_START.md) - i18n 系统使用指南
- [i18n 使用示例](/docs/I18N_USAGE_EXAMPLES.md) - 完整示例代码

---

## 🎯 总结

| 问题 | 答案 |
|------|------|
| **使用哪个版本？** | Tailwind 版本（默认） |
| **CSS 文件在哪？** | `shared` 包中，不在 Backend |
| **需要导入 CSS 吗？** | 不需要（使用 Tailwind 版本） |
| **可以删除 CSS 版本吗？** | 可以，但建议保留作为备选 |
| **如何自定义样式？** | 通过 `className` 传递 Tailwind 类 |

**推荐配置**：保持当前配置，默认使用 Tailwind 版本，无需修改任何内容！✨

---

**最后更新**: 2025-10-26
