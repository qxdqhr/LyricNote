# 贡献指南 | Contributing Guide

感谢你考虑为本项目做出贡献！

## 🚀 开始之前

在开始贡献之前，请确保：

1. 已阅读项目的 [README.md](./README.md)
2. 了解项目的架构和技术栈
3. 查看现有的 [Issues](https://github.com/your-org/your-app/issues) 和
   [Pull Requests](https://github.com/your-org/your-app/pulls)

## 📋 开发环境设置

### 1. Fork 和 Clone 项目

```bash
# Fork 项目到你的 GitHub 账户
# 然后 clone 你的 fork
git clone https://github.com/YOUR_USERNAME/your-app.git
cd your-app

# 添加上游仓库
git remote add upstream https://github.com/your-org/your-app.git
```

### 2. 安装依赖

```bash
# 安装 pnpm（如果还没有）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp packages/backend/.env.example packages/backend/.env.local

# 编辑环境变量
nano packages/backend/.env.local
```

### 4. 初始化数据库

```bash
pnpm devdb:generate
pnpm devdb:push
```

### 5. 启动开发服务器

```bash
# 启动后端
pnpm dev:backend

# 或启动所有服务
pnpm dev
```

## 🔀 工作流程

### 1. 创建新分支

始终从最新的 `main` 分支创建新分支：

```bash
# 更新本地 main 分支
git checkout main
git pull upstream main

# 创建新的功能分支
git checkout -b feature/your-feature-name

# 或者修复 bug
git checkout -b fix/bug-description
```

### 2. 分支命名规范

- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建/工具配置等

示例：

- `feature/add-user-profile`
- `fix/login-error`
- `docs/update-readme`

### 3. 编码规范

#### TypeScript/JavaScript

- 使用 TypeScript 进行类型安全
- 遵循 ESLint 和 Prettier 配置
- 变量和函数使用有意义的命名
- 添加必要的注释和文档

```typescript
// ✅ 好的示例
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

async function getUserProfile(userId: string): Promise<UserProfile> {
  // 获取用户资料
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user;
}

// ❌ 不好的示例
async function get(id: string): Promise<any> {
  const u = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return u;
}
```

#### 组件规范

```tsx
// ✅ React 组件示例
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
}) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
};
```

### 4. 提交规范

我们使用语义化提交信息：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化

#### 示例

```bash
# 新功能
git commit -m "feat(auth): 添加 OAuth 登录支持"

# Bug 修复
git commit -m "fix(api): 修复用户注册时的验证问题"

# 文档更新
git commit -m "docs(readme): 更新安装说明"

# 重构
git commit -m "refactor(database): 优化数据库查询性能"
```

### 5. 代码检查

在提交前，代码会自动通过 lint-staged 进行检查：

```bash
# 手动运行检查
pnpm lint
pnpm format:check

# 自动修复
pnpm format
```

### 6. 测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm test:backend
pnpm test:mobile
```

### 7. 提交 Pull Request

```bash
# 推送你的分支
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request：

1. 填写 PR 模板中的所有必要信息
2. 描述你的更改和原因
3. 关联相关的 Issue（如果有）
4. 等待代码审查

## 📝 Pull Request 要求

### PR 模板

```markdown
## 变更描述

<!-- 简要描述你的更改 -->

## 变更类型

- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 测试

- [ ] 已通过所有现有测试
- [ ] 已添加新的测试
- [ ] 已手动测试

## 相关 Issue

<!-- 关联的 Issue 编号，如：Closes #123 -->

## 截图（如适用）

<!-- 添加截图来说明你的更改 -->

## 检查清单

- [ ] 代码遵循项目的编码规范
- [ ] 已更新相关文档
- [ ] 已添加必要的注释
- [ ] 没有引入新的警告
- [ ] 所有测试通过
```

### PR 审查标准

你的 PR 将根据以下标准进行审查：

1. **代码质量**
   - 遵循项目的编码规范
   - 代码清晰、可读
   - 适当的错误处理

2. **功能性**
   - 实现了预期功能
   - 没有破坏现有功能
   - 边界情况处理正确

3. **测试**
   - 包含必要的测试
   - 测试覆盖率合理
   - 所有测试通过

4. **文档**
   - 必要的代码注释
   - 更新相关文档
   - README 更新（如需要）

5. **性能**
   - 没有明显的性能问题
   - 数据库查询优化
   - 合理的资源使用

## 🐛 报告 Bug

### 使用 Issue 模板

创建 Bug 报告时，请包含：

1. **环境信息**
   - 操作系统
   - Node.js 版本
   - pnpm 版本
   - 浏览器版本（如适用）

2. **复现步骤**
   - 详细的步骤说明
   - 预期行为
   - 实际行为

3. **错误日志**
   - 完整的错误堆栈
   - 相关日志

4. **截图/录屏**（如适用）

### Bug 报告示例

````markdown
## Bug 描述

用户登录后，个人资料页面显示 404 错误

## 环境

- OS: macOS 13.0
- Node: 18.17.0
- pnpm: 8.15.0
- Browser: Chrome 120.0

## 复现步骤

1. 打开应用
2. 使用有效凭证登录
3. 点击导航栏的"个人资料"链接
4. 看到 404 错误页面

## 预期行为

应该显示用户的个人资料页面

## 实际行为

显示 404 错误页面

## 错误日志

\``` Error: Page not found at Router.push (/src/router.ts:45) ... \```

## 截图

[附上截图]
````

## 💡 提议新功能

### 功能请求模板

```markdown
## 功能描述

<!-- 简要描述新功能 -->

## 使用场景

<!-- 为什么需要这个功能？解决什么问题？ -->

## 建议的实现方案

<!-- 你认为应该如何实现？ -->

## 替代方案

<!-- 是否有其他可行的方案？ -->

## 附加信息

<!-- 其他相关信息 -->
```

## 📚 文档贡献

文档同样重要！你可以帮助：

- 修复文档中的错误
- 改进现有文档的清晰度
- 添加示例和教程
- 翻译文档

## 🎨 设计贡献

如果你有设计技能，可以贡献：

- UI/UX 改进建议
- 图标和插图
- 品牌资源
- 用户体验优化

## ❓ 获取帮助

如果你在贡献过程中遇到问题：

1. 查看 [FAQ](./docs/faq.md)
2. 搜索现有的 [Issues](https://github.com/your-org/your-app/issues)
3. 在 [Discussions](https://github.com/your-org/your-app/discussions) 提问
4. 联系维护者

## 📜 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 尊重不同的观点和经验
- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 人身攻击或贬损评论
- 骚扰（公开或私下）
- 未经许可发布他人的私人信息
- 其他不道德或不专业的行为

## 📄 许可证

通过贡献，你同意你的贡献将在与项目相同的 MIT 许可证下授权。

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

你的贡献，无论大小，都对项目的成功至关重要。

---

再次感谢你的贡献！🎉
