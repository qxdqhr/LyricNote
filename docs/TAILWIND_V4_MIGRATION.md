# Tailwind CSS v4 迁移指南

本指南说明 Tailwind CSS v4 的主要变更以及如何从 v3 迁移。

## 📋 主要变更

### 1. PostCSS 插件分离

**v3 配置:**

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**v4 配置:**

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // 新的独立包
    autoprefixer: {},
  },
};
```

### 2. CSS 导入语法变更

**v3 语法:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**v4 语法:**

```css
@import 'tailwindcss';
```

### 3. 安装依赖变更

**v3 安装:**

```bash
pnpm add -D tailwindcss postcss autoprefixer
```

**v4 安装:**

```bash
pnpm add -D tailwindcss @tailwindcss/postcss autoprefixer
```

## 🔧 迁移步骤

### Backend (Next.js)

1. **安装新依赖**

```bash
cd packages/backend
pnpm add -D @tailwindcss/postcss
```

2. **更新 postcss.config.mjs**

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // 改用新插件
    autoprefixer: {},
  },
};

export default config;
```

3. **更新 globals.css**

```css
/* 从 v3 语法 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 改为 v4 语法 */
@import 'tailwindcss';
```

### Desktop (Electron + Vite)

1. **安装新依赖**

```bash
cd packages/desktop
pnpm add -D @tailwindcss/postcss
```

2. **更新 postcss.config.js**

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

3. **更新 CSS 文件**

```css
/* src/styles/index.css */
@import 'tailwindcss';

/* 其他自定义样式 */
```

## ⚠️ 常见问题

### 问题 1: PostCSS 插件错误

**错误信息:**

```
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
The PostCSS plugin has moved to a separate package...
```

**解决方案:**

1. 安装 `@tailwindcss/postcss`
2. 更新 PostCSS 配置使用 `'@tailwindcss/postcss': {}`

### 问题 2: CSS 语法错误

**错误信息:**

```
Unknown at-rule @tailwind
```

**解决方案:** 将 `@tailwind base/components/utilities` 改为
`@import "tailwindcss"`

### 问题 3: 模块警告

**警告信息:**

```
Module type of file:///path/to/postcss.config.js is not specified...
```

**解决方案:** 在 `package.json` 中添加:

```json
{
  "type": "module"
}
```

## 📦 各平台版本总结

| 平台        | Tailwind 版本       | PostCSS 插件           | CSS 语法                |
| ----------- | ------------------- | ---------------------- | ----------------------- |
| **Backend** | v4                  | `@tailwindcss/postcss` | `@import "tailwindcss"` |
| **Desktop** | v4                  | `@tailwindcss/postcss` | `@import "tailwindcss"` |
| **Mobile**  | v3 (via NativeWind) | -                      | NativeWind 自动处理     |
| **MiniApp** | v3 (via weapp)      | `tailwindcss`          | `@tailwind` 指令        |

## 📚 参考资源

- [Tailwind CSS v4 官方文档](https://tailwindcss.com/docs/v4-beta)
- [PostCSS 插件迁移](https://tailwindcss.com/docs/upgrade-guide#migrating-to-the-postcss-plugin)
- [NativeWind 文档](https://www.nativewind.dev/)
- [weapp-tailwindcss 文档](https://github.com/sonofmagic/weapp-tailwindcss)

## ✅ 迁移检查清单

Backend:

- [ ] 安装 `@tailwindcss/postcss`
- [ ] 更新 `postcss.config.mjs`
- [ ] 更新 `src/app/globals.css`
- [ ] 测试构建: `pnpm build`

Desktop:

- [ ] 安装 `@tailwindcss/postcss`
- [ ] 更新 `postcss.config.js`
- [ ] 更新 `src/styles/index.css`
- [ ] 测试开发服务器: `pnpm dev`

Mobile & MiniApp:

- [ ] 保持使用 v3 版本(通过适配器)
- [ ] 不需要迁移

## 🎯 优势说明

Tailwind v4 的主要优势:

1. **性能提升**: 更快的构建速度
2. **简化语法**: 统一的 `@import` 语法
3. **模块化**: PostCSS 插件独立维护
4. **类型安全**: 更好的 TypeScript 支持
5. **自动优化**: 内置更多优化

## 🔄 回退方案

如果遇到问题需要回退到 v3:

```bash
# 卸载 v4
pnpm remove tailwindcss @tailwindcss/postcss

# 安装 v3
pnpm add -D tailwindcss@^3

# 恢复 v3 配置
# 1. postcss.config.js 使用 tailwindcss: {}
# 2. CSS 使用 @tailwind 指令
```
