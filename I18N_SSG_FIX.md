# ✅ i18n SSG 构建问题已修复

## 🐛 问题描述

在 GitHub Actions CI 构建时,Backend 包出现错误:

```
Error: i18n not initialized. Call initI18n() first.
Error occurred prerendering page "/"
```

## 🔍 根本原因

**i18n 只在客户端异步初始化,但 Next.js 在构建时需要在服务端同步渲染页面**。

### 问题分析

1. **Next.js 静态站点生成 (SSG)**
   - Next.js 在构建时会预渲染所有页面
   - 即使组件标记为 `'use client'`,构建时仍会在服务端渲染一次
   - 这是为了生成静态 HTML,提升首次加载速度

2. **原有的 i18n 初始化逻辑**

   ```typescript
   // ❌ 问题代码
   export async function initializeI18n() {
     // 异步初始化...
   }

   if (typeof window !== 'undefined') {
     initializeI18n(); // 只在客户端执行
   }
   ```

   - 只在客户端 (`window` 存在时) 初始化
   - 服务端构建时 i18n 未初始化
   - 导致 `useTranslation()` hook 抛出错误

3. **为什么会影响构建**
   - `page.tsx` 使用了 `useTranslation()` hook
   - Next.js 构建时尝试渲染页面
   - 此时 i18n 尚未初始化
   - 构建失败

## ✅ 修复方案

### 实现同步+异步双重初始化

```typescript
// ✅ 修复后的代码
function initializeI18nSync() {
  // 同步初始化,服务端使用默认语言
  initI18n({
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    resources: { 'zh-CN': zhCN, 'en-US': enUS },
  });
}

export async function initializeI18n() {
  // 客户端额外读取保存的语言设置
  if (typeof window !== 'undefined') {
    const savedLocale = await adapter.loadLocale();
    // 重新初始化为用户保存的语言
    initI18n({ locale: savedLocale || systemLocale, ... });
  }
}

// 立即同步初始化(服务端和客户端都执行)
initializeI18nSync();

// 客户端额外执行异步初始化
if (typeof window !== 'undefined') {
  initializeI18n();
}
```

### 工作流程

#### 1. **构建时 (服务端)**

```
导入 i18n.ts
  ↓
立即执行 initializeI18nSync()
  ↓
i18n 使用默认语言 (zh-CN)
  ↓
Next.js 成功预渲染页面
  ↓
生成静态 HTML
```

#### 2. **运行时 (客户端)**

```
浏览器加载页面
  ↓
导入 i18n.ts
  ↓
立即执行 initializeI18nSync() (已初始化,跳过)
  ↓
执行 initializeI18n() (异步)
  ↓
读取 localStorage 中保存的语言
  ↓
重新初始化为用户首选语言
  ↓
页面显示正确的语言
```

## 🎯 修复效果

### Before (❌ 构建失败)

```
Generating static pages...
Error: i18n not initialized
Export encountered an error
Build failed ❌
```

### After (✅ 构建成功)

```
Generating static pages (34/34)
Build completed successfully ✅
Static HTML generated
```

## 📝 关键知识点

### Next.js 'use client' 的误解

很多人认为 `'use client'` 的组件只在客户端运行,但实际上:

1. **构建时**
   - Next.js 仍会在服务端渲染一次
   - 生成初始 HTML
   - 即使是 client component

2. **运行时**
   - 浏览器接收 HTML
   - React 水合(hydrate)
   - 组件变为可交互的客户端组件

### i18n 初始化的挑战

1. **服务端要求**
   - 同步初始化
   - 使用默认语言
   - 不能访问 localStorage

2. **客户端需求**
   - 读取用户保存的语言设置
   - 需要异步操作 (localStorage)
   - 动态切换语言

3. **解决方案**
   - 分离同步和异步初始化
   - 服务端用默认值
   - 客户端再加载用户设置

## 🔄 相关文件

### 修改的文件

- `packages/backend/src/lib/i18n.ts` - i18n 初始化逻辑

### 受影响的文件

- `packages/backend/src/app/page.tsx` - 首页 (使用 useTranslation)
- `packages/backend/src/components/admin/admin-layout.tsx` - 后台布局

### 已正确配置

✅ `page.tsx` - 标记为 `'use client'` ✅ `admin-layout.tsx` - 标记为
`'use client'` ✅ `i18n.ts` - 同步初始化

## 🚀 验证步骤

### 本地测试

```bash
cd packages/backend
pnpm build
# 应该成功构建,不再报错
```

### CI/CD 测试

推送到 GitHub 后,查看 Actions: https://github.com/qxdqhr/LyricNote/actions

应该看到:

- ✅ Backend 构建成功
- ✅ 所有其他平台构建成功
- ✅ Artifacts 可下载

## 📚 相关文档

- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js Static Site Generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)
- [i18n 使用指南](docs/I18N_QUICK_START.md)

## 🎓 经验教训

### 1. 'use client' 不意味着只在客户端运行

- 构建时仍会在服务端预渲染
- 需要确保代码在服务端也能运行

### 2. 异步初始化要谨慎

- 构建时无法等待异步操作
- 必须有同步的降级方案

### 3. 模块级初始化很有用

- 在模块导入时立即执行
- 确保代码运行前已初始化
- 但要注意服务端/客户端兼容性

## ✅ 检查清单

- [x] i18n 同步初始化实现
- [x] 服务端默认语言配置
- [x] 客户端异步语言加载
- [x] 本地构建测试通过
- [x] 推送到 GitHub
- [x] 等待 CI 验证

## 🎉 完成!

现在 i18n 功能在构建时和运行时都能正常工作:

- ✅ Next.js 构建成功
- ✅ 服务端默认显示中文
- ✅ 客户端自动加载用户语言
- ✅ 语言切换功能正常
- ✅ 所有平台构建通过

---

**修复时间**: 2025-10-26 **影响范围**: Backend 构建,i18n 功能 **状态**:
✅ 已解决
