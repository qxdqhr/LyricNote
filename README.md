# 🎌 LyricNote - 日语音乐识别应用

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

> 专注于日语歌曲识别和歌词处理的全栈应用，支持汉字、平假名、罗马音多语言显示

## 📋 项目概述

LyricNote 是一个基于 AI 的日语音乐识别应用，为日语学习者和日本音乐爱好者提供强大的音乐识别和歌词处理功能。

### 🎯 核心功能

- **🎤 AI 音乐识别** - 基于 DeepSeek 大模型的日语歌曲识别
- **📝 多语言歌词** - 汉字、平假名、罗马音三种显示模式
- **🎌 日语学习** - 专为日语学习优化的功能设计
- **📱 跨平台应用** - React Native 移动端 + Next.js Web 管理后台
- **🤖 智能处理** - AI 增强的歌词转换和翻译
- **📊 数据分析** - 完整的用户行为和学习进度统计

## 🏗 项目架构

本项目采用 **Monorepo** 架构，统一管理前后端代码：

```
LyricNote/
├── packages/
│   ├── mobile/          # React Native 移动端应用
│   ├── backend/         # Next.js 后端 + Web 管理后台
│   └── shared/          # 共享类型、常量和工具
├── docs/               # 项目文档
├── tools/              # 构建工具和脚本
└── scripts/            # 自动化脚本
```

### 📦 包结构

| 包名 | 技术栈 | 描述 |
|------|--------|------|
| **mobile** | React Native + Expo | 移动端应用，用户主要交互界面 |
| **backend** | Next.js + Prisma | 后端 API + Web 管理后台 |
| **shared** | TypeScript | 共享类型定义、常量和工具函数 |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 8+
- PostgreSQL 14+ (后端数据库)
- Redis 6+ (缓存，可选)

### 1. 克隆项目

```bash
git clone https://github.com/your-org/lyricnote.git
cd lyricnote
```

### 2. 安装依赖

```bash
npm run setup
```

### 3. 环境配置

```bash
# 复制后端环境配置
cp packages/backend/env.example packages/backend/.env
# 编辑配置文件，设置数据库连接等
```

### 4. 初始化数据库

```bash
npm run db:push
npm run db:seed
```

### 5. 启动开发服务器

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:backend  # 后端: http://localhost:3000
npm run dev:mobile   # 移动端: http://localhost:8081
```

## 📱 应用截图

### 移动端应用
- **首页** - 音频录制和识别
- **歌词页** - 多语言歌词显示和同步
- **收藏页** - 歌曲收藏和分类管理

### Web 管理后台
- **管理地址**: http://localhost:3000/admin
- **默认账户**: admin@lyricnote.com / admin123456

## 🛠 开发命令

### 全局命令

```bash
npm run dev          # 启动全部服务
npm run build        # 构建全部项目
npm run test         # 运行全部测试
npm run lint         # 代码风格检查
npm run clean        # 清理依赖和构建文件
```

### 数据库管理

```bash
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 推送数据库模式
npm run db:seed      # 初始化种子数据
npm run db:studio    # 打开数据库管理界面
```

### 包特定命令

```bash
npm run dev:backend   # 只启动后端
npm run dev:mobile    # 只启动移动端
npm run build:backend # 只构建后端
npm run build:mobile  # 只构建移动端
```

## 📚 项目文档

| 文档 | 位置 | 描述 |
|------|------|------|
| **完整项目文档** | [docs/project-document.md](docs/project-document.md) | 详细的产品设计和技术文档 |
| **API 文档** | [packages/backend/README.md](packages/backend/README.md) | 后端 API 接口文档 |
| **移动端文档** | [packages/mobile/README.md](packages/mobile/README.md) | React Native 应用文档 |
| **部署指南** | [docs/deployment.md](docs/deployment.md) | 生产环境部署说明 |

## 🔧 技术栈

### 前端技术
- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发工具链
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 原子化 CSS 框架

### 后端技术
- **Next.js** - 全栈 React 框架
- **Prisma** - 现代化数据库 ORM
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **JWT** - 用户认证

### AI 和日语处理
- **DeepSeek API** - AI 大模型服务
- **Kuroshiro.js** - 日语假名转换
- **MeCab** - 日语形态素分析

## 🔐 安全和权限

### 认证系统
- JWT Token 认证
- 会话管理
- 角色权限控制

### 默认管理员账户
- **邮箱**: admin@lyricnote.com
- **密码**: admin123456
- **⚠️ 生产环境请务必修改默认密码**

## 📊 项目状态

### 开发进度
- ✅ 后端 API 系统
- ✅ Web 管理后台
- ✅ 移动端核心功能
- ✅ 数据库设计
- ✅ AI 服务集成
- 🚧 生产环境部署
- 🚧 单元测试完善

### 性能指标
- 🎯 音频识别准确率: >90%
- ⚡ API 响应时间: <200ms
- 📱 应用启动时间: <3s
- 🔄 歌词转换速度: <1s

## 🤝 贡献指南

我们欢迎各种形式的贡献！

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 编写有意义的提交信息
- 添加必要的测试用例

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 📞 联系我们

- **项目地址**: https://github.com/your-org/lyricnote
- **问题反馈**: [Issues](https://github.com/your-org/lyricnote/issues)
- **邮箱**: support@lyricnote.com

## 🙏 致谢

感谢以下开源项目和服务：

- [React Native](https://reactnative.dev/) - 移动应用框架
- [Next.js](https://nextjs.org/) - 全栈 React 框架
- [Prisma](https://prisma.io/) - 数据库工具
- [DeepSeek](https://deepseek.com/) - AI 大模型服务
- [Kuroshiro](https://github.com/hexenq/kuroshiro) - 日语处理库

---

🎌 **LyricNote** - 让日语音乐学习更简单！
