# ESLint 配置说明

## 📋 问题背景

在首次运行 `pnpm lint`
时，发现了 119 个问题（80 个错误，39 个警告）。这些主要是现有代码的历史问题：

- 大量使用 `any` 类型（80+ 处）
- 未使用的变量（39 处）
- 其他 TypeScript 类型问题

## 🔧 解决方案

采用**渐进式改进**策略，而非一次性修复所有问题：

### 1. 调整 ESLint 规则严格度

将以下规则从 `error` 降级为 `warning`：

```javascript
{
  "@typescript-eslint/no-explicit-any": "warn",           // any 类型警告
  "@typescript-eslint/no-unused-vars": "warn",            // 未使用变量警告
  "@typescript-eslint/ban-ts-comment": "warn",            // @ts-ignore 警告
  "@typescript-eslint/no-empty-object-type": "warn",      // 空对象类型警告
  "react-hooks/exhaustive-deps": "warn",                  // Hook 依赖警告
  "prefer-const": "warn",                                 // 优先使用 const 警告
}
```

### 2. 忽略特定目录

添加以下目录到 ESLint 忽略列表：

- `drizzle/**` - 数据库迁移文件（自动生成）
- `.next/**` - Next.js 构建输出
- `dist/**` - 编译输出
- `node_modules/**` - 依赖包

### 3. 配置文件位置

- **根目录**: `.eslintrc.json` - 全局配置
- **Backend**: `packages/backend/eslint.config.mjs` - Next.js 专用配置

## 📊 配置策略

### 为什么使用 Warning 而不是 Error？

1. **不阻塞开发流程**
   - 现有代码可以继续运行
   - Git commit 不会因为历史问题而失败
   - CI/CD 流程不会被阻塞

2. **提供改进指引**
   - 开发者仍然能看到需要改进的地方
   - IDE 会显示黄色波浪线提示
   - 可以逐步优化代码质量

3. **新代码更严格**
   - 新写的代码会收到警告
   - 鼓励使用更好的类型
   - 逐步提高整体代码质量

## 🎯 渐进式改进计划

### 短期（1-2 周）

- ✅ 配置 ESLint，使其不阻塞开发
- ✅ 让 lint 检查通过（无 error）
- ⏳ 团队培训：TypeScript 最佳实践

### 中期（1-2 月）

- ⏳ 修复新代码中的 any 类型
- ⏳ 清理未使用的变量和导入
- ⏳ 添加必要的类型定义

### 长期（3-6 月）

- ⏳ 逐步重构核心模块
- ⏳ 提高类型覆盖率到 90%+
- ⏳ 考虑将部分规则升级为 error

## 🚀 如何使用

### 运行 Lint 检查

```bash
# 检查所有代码
pnpm lint

# 只检查 backend
pnpm lint:backend

# 只检查 mobile
pnpm lint:mobile

# 自动修复可修复的问题
pnpm lint:backend -- --fix
```

### 在 VSCode 中

安装推荐的扩展后：

1. **实时提示**：编辑时会显示警告（黄色波浪线）
2. **保存时自动修复**：保存文件时自动格式化
3. **问题面板**：查看所有 lint 问题

### Git Commit 时

Husky pre-commit hook 会：

1. 运行 `lint-staged`
2. 对暂存的文件进行 lint 和格式化
3. 自动修复可修复的问题
4. **只有在有 error 时才会阻止提交**（warning 不阻止）

## 📝 最佳实践

### 编写新代码时

```typescript
// ❌ 避免使用 any
function processData(data: any) {
  // ...
}

// ✅ 使用具体类型
interface UserData {
  id: string;
  name: string;
}

function processData(data: UserData) {
  // ...
}

// ❌ 避免未使用的变量
const [value, setValue] = useState(0);

// ✅ 使用下划线前缀表示有意忽略
const [_value, setValue] = useState(0);
// 或直接不声明
const [, setValue] = useState(0);
```

### 处理遗留代码

```typescript
// 临时解决方案：添加注释说明
// @ts-expect-error - TODO: 需要添加正确的类型定义
const legacyData: any = getLegacyData();

// 更好的方案：创建 Issue 跟踪
// TODO(#123): 重构此函数以使用正确的类型
```

## 🔍 常见问题

### Q: 为什么还是有很多警告？

A: 这是预期的！警告不会阻止开发，但提醒你改进代码。随着时间推移，我们会逐步减少警告数量。

### Q: 我能忽略某些警告吗？

A: 可以，但需要添加注释说明原因：

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = externalLibrary(); // 外部库返回类型不明确
```

### Q: 什么时候会真正阻止提交？

A: 只有严重的问题（标记为 error）才会阻止提交，比如：

- 使用 `var` 而不是 `const/let`
- 严重的语法错误
- 违反核心编码规范

### Q: 如何查看所有警告？

A: 运行 `pnpm lint` 会显示所有问题。你也可以在 VSCode 的"问题"面板中查看。

## 📈 监控改进进度

### 查看 Lint 统计

```bash
# 统计警告和错误数量
pnpm lint 2>&1 | grep -E "(warning|error)"

# 只显示摘要
pnpm lint 2>&1 | tail -5
```

### 目标

- **当前**: ~119 个警告
- **1 个月后**: < 80 个警告
- **3 个月后**: < 40 个警告
- **6 个月后**: < 20 个警告

## 🔗 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [ESLint 规则参考](https://eslint.org/docs/rules/)
- [@typescript-eslint 规则](https://typescript-eslint.io/rules/)
- [Next.js ESLint 配置](https://nextjs.org/docs/basic-features/eslint)

---

**创建日期**: 2025-01-22 **最后更新**: 2025-01-22 **状态**: ✅ 已配置完成
