# 更新日志 | Changelog

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本遵循
[语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增 | Added

- 统一包管理器配置（强制使用 pnpm）
- 项目根目录 README.md 文档
- 环境变量配置指南 (ENV_SETUP.md)
- Prettier 代码格式化配置
- ESLint 代码质量检查配置
- EditorConfig 编辑器配置
- VSCode 工作区配置和推荐扩展
- Husky Git hooks 配置
- lint-staged 预提交检查
- 贡献指南 (CONTRIBUTING.md)
- LICENSE 文件
- .gitattributes 文件

### 变更 | Changed

- 统一 React 版本到 18.2.0
- 统一 TypeScript 版本到 5.3.3
- 所有 npm 命令改为 pnpm 命令

### 修复 | Fixed

- 删除重复的 package-lock.json 文件

## [1.0.0] - 2025-01-XX

### 新增 | Added

- 多端应用框架初始版本
- 后端服务 (Next.js)
- 移动端应用 (React Native)
- 桌面端应用 (Electron)
- 小程序应用 (Taro)
- 共享代码库
- 用户认证系统
- 数据库集成 (PostgreSQL + Drizzle ORM)
- CI/CD 配置

---

## 版本说明

### 类型定义

- `新增 | Added` - 新功能
- `变更 | Changed` - 现有功能的变更
- `弃用 | Deprecated` - 即将移除的功能
- `移除 | Removed` - 已移除的功能
- `修复 | Fixed` - Bug 修复
- `安全 | Security` - 安全性相关更新

### 版本号格式

给定版本号 MAJOR.MINOR.PATCH (主版本号.次版本号.修订号)：

1. MAJOR - 不兼容的 API 修改
2. MINOR - 向下兼容的功能性新增
3. PATCH - 向下兼容的问题修正
