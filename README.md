# 🚀 Multi-Platform Application Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

> 🎯 **可快速定制的多端应用开发框架** - 支持移动端(React Native)、小程序(Taro)、桌面端(Electron)和Web管理后台(Next.js)，只需修改配置即可快速定制为任何类型的应用。

---

## ⚡ 框架特性

### 🎯 一次开发，四端部署

本框架提供了完整的多端应用解决方案，包含：

| 平台 | 技术栈 | 状态 | 说明 |
|------|--------|------|------|
| 🖥️ **Backend** | Next.js 15 + PostgreSQL | ✅ 可用 | RESTful API + Web管理后台 |
| 📱 **Mobile** | React Native + Expo | ✅ 可用 | iOS / Android 原生应用 |
| 🎮 **Miniapp** | Taro 3 | ✅ 可用 | 微信小程序 |
| 💻 **Desktop** | Electron + React | ✅ 可用 | macOS / Windows / Linux |

### ✨ 核心优势

- ✅ **统一配置管理** - 所有品牌文案集中在一个文件中 (`packages/shared/src/constants/index.ts`)
- ✅ **3步快速定制** - 修改配置 → 构建 → 启动，即可成为全新应用
- ✅ **多端配置同步** - 一次修改，Backend/Mobile/Miniapp/Desktop 所有端自动同步
- ✅ **TypeScript全栈** - 完整的类型定义和智能提示
- ✅ **开箱即用** - 认证系统、数据库、API、UI组件全部配置完成
- ✅ **CI/CD就绪** - 包含GitHub Actions配置，支持自动构建和部署
- ✅ **Docker支持** - 后端服务容器化，一键部署

---

## 🚀 快速开始

### 📝 快速定制为你的应用（3步）

#### 步骤1：修改应用配置

编辑 `packages/shared/src/constants/index.ts`：

```typescript
export const APP_CONFIG = {
  name: 'YourAppName',              // 👈 改成你的应用名
  fullName: 'YourApp - 你的应用描述',
  icon: '🎵',                        // 👈 改成你的图标emoji
  description: '你的应用简介',
  version: '1.0.0',
  author: 'Your Team',               // 👈 改成你的团队
  copyright: `© ${new Date().getFullYear()} YourAppName`,
}
```

#### 步骤2：构建共享包

```bash
cd packages/shared
pnpm build
```

#### 步骤3：启动应用测试

```bash
# 启动Backend
cd packages/backend
pnpm dev

# 启动Desktop
cd packages/desktop
pnpm electron:dev

# 启动Mobile
cd packages/mobile
pnpm dev

# 启动Miniapp
cd packages/miniapp
pnpm dev
```

**完成！** 所有端的名称、图标、描述都会自动更新！✨

---

## 📖 详细文档

### 🎯 框架定制（必读）

| 文档 | 说明 | 重要性 |
|------|------|--------|
| [CONFIG_GUIDE.md](./CONFIG_GUIDE.md) | ⭐ 应用配置完整指南 | 必读 |
| [FRAMEWORK_MIGRATION.md](./FRAMEWORK_MIGRATION.md) | 框架化改造说明 | 推荐 |
| [自动构建说明.md](./自动构建说明.md) | 自动构建配置 | 推荐 |

### 📚 技术文档

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 系统架构和技术栈 |
| [CI_CD打包方案.md](./CI_CD打包方案.md) | 自动打包和发布 |
| [数据库问题解决方案.md](./数据库问题解决方案.md) | 数据库配置指南 |

### 📦 各端文档

| 端 | 文档 |
|----|------|
| Backend | [packages/backend/README.md](./packages/backend/README.md) |
| Mobile | [packages/mobile/README.md](./packages/mobile/README.md) |
| Miniapp | [MINIAPP_GUIDE.md](./MINIAPP_GUIDE.md) |
| Desktop | [packages/desktop/README.md](./packages/desktop/README.md) |

---

## 🏗️ 项目架构

### Monorepo结构

```
project-root/
├── packages/
│   ├── shared/                 # 📦 共享包（核心配置）
│   │   └── src/
│   │       ├── constants/      # ⭐ 应用配置（修改这里）
│   │       ├── types/          # TypeScript类型定义
│   │       └── utils/          # 工具函数
│   │
│   ├── backend/                # 🖥️ Next.js后端 + Web管理后台
│   │   ├── src/
│   │   │   ├── app/           # Next.js页面和API路由
│   │   │   ├── components/    # React组件
│   │   │   └── lib/           # 业务逻辑
│   │   └── drizzle/           # 数据库Schema
│   │
│   ├── mobile/                 # 📱 React Native移动应用
│   │   ├── src/
│   │   │   ├── screens/       # 页面
│   │   │   ├── components/    # 组件
│   │   │   └── navigation/    # 导航
│   │   └── app.json           # Expo配置
│   │
│   ├── miniapp/                # 🎮 Taro微信小程序
│   │   ├── src/
│   │   │   ├── pages/         # 小程序页面
│   │   │   └── app.config.ts  # 小程序配置
│   │   └── project.config.json
│   │
│   └── desktop/                # 💻 Electron桌面应用
│       ├── src/               # React界面
│       ├── electron/          # Electron主进程
│       └── package.json
│
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
├── scripts/                   # 自动化脚本
└── docs/                      # 项目文档
```

---

## 🛠️ 技术栈

### 前端技术

| 技术 | 用途 | 版本 |
|------|------|------|
| **React** | UI框架 | 18+ |
| **React Native** | 移动端开发 | 0.81+ |
| **Next.js** | 后端和管理后台 | 15+ |
| **Taro** | 小程序开发 | 3.6+ |
| **Electron** | 桌面应用 | 28+ |
| **TypeScript** | 类型系统 | 5.0+ |
| **TailwindCSS** | 样式框架 | 3.4+ |

### 后端技术

| 技术 | 用途 | 版本 |
|------|------|------|
| **PostgreSQL** | 主数据库 | 15+ |
| **Drizzle ORM** | 数据库ORM | 最新 |
| **Better Auth** | 认证系统 | 最新 |
| **Docker** | 容器化部署 | 最新 |

### 开发工具

| 工具 | 用途 |
|------|------|
| **pnpm** | 包管理器 |
| **Vite** | 构建工具 |
| **ESLint** | 代码检查 |
| **GitHub Actions** | CI/CD |

---

## 🎓 开发指南

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker（推荐）
- PostgreSQL 15+（或使用Docker）

### 初始化项目

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd <project-name>

# 2. 安装依赖
pnpm install

# 3. 构建共享包
pnpm build:shared

# 4. 启动PostgreSQL（使用Docker）
docker run -d \
  --name app-postgres \
  -e POSTGRES_USER=lyricnote_dev \
  -e POSTGRES_PASSWORD=dev_password_123 \
  -e POSTGRES_DB=lyricnote_dev \
  -p 5433:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine

# 5. 初始化数据库
cd packages/backend
pnpm db:dev:push

# 6. 启动开发服务器
pnpm dev
```

### 开发命令

#### 根目录命令

```bash
# 构建所有包
pnpm build

# 只构建shared包
pnpm build:shared

# 启动各端开发服务器
pnpm dev:backend    # Backend + 管理后台
pnpm dev:mobile     # React Native应用
pnpm dev:miniapp    # 微信小程序
pnpm dev:desktop    # Electron桌面应用
```

#### Backend命令

```bash
cd packages/backend

pnpm dev            # 启动开发服务器（自动构建shared）
pnpm build          # 构建生产版本
pnpm start          # 启动生产服务器

# 数据库命令
pnpm db:dev:push        # 推送Schema到数据库
pnpm db:dev:generate    # 生成迁移文件
pnpm devdb:studio       # 打开Drizzle Studio
```

#### Desktop命令

```bash
cd packages/desktop

pnpm electron:dev   # 启动Electron开发模式（自动构建shared）
pnpm build          # 构建桌面应用安装包
```

#### Mobile命令

```bash
cd packages/mobile

pnpm dev            # 启动Expo开发服务器（自动构建shared）
pnpm android        # 在Android设备上运行
pnpm ios            # 在iOS设备上运行
```

#### Miniapp命令

```bash
cd packages/miniapp

pnpm dev            # 启动小程序开发模式（自动构建shared）
pnpm build          # 构建小程序生产版本
```

---

## 🔧 配置说明

### 核心配置文件

#### 应用配置（主要修改这里）

**`packages/shared/src/constants/index.ts`**

包含所有可配置项：
- 应用基础信息（名称、图标、描述）
- 应用标题文案
- UI文案（按钮、菜单、提示）
- 主题配置（颜色）
- 业务配置（常量）
- 环境配置（API地址）

#### 数据库配置

**`packages/backend/.env.local`**

```env
DATABASE_URL="postgresql://user:password@localhost:5433/dbname"
NODE_ENV=development
PORT=3000
```

#### 移动端配置

**`packages/mobile/app.json`** - Expo配置
**`packages/mobile/eas.json`** - EAS Build配置

#### 小程序配置

**`packages/miniapp/project.config.json`** - 小程序项目配置
**`packages/miniapp/src/app.config.ts`** - 应用配置

---

## 🚢 部署

### Backend部署

#### 方式1：Docker部署（推荐）

```bash
# 构建镜像
docker build -f packages/backend/Dockerfile -t app .

# 运行容器
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name app-backend \
  app
```

#### 方式2：GitHub Actions自动部署

已配置 `.github/workflows/deploy.yml`，推送到main分支自动触发：
1. 构建Docker镜像
2. 推送到阿里云容器镜像
3. 自动部署到服务器

### Desktop打包

查看 [CI_CD打包方案.md](./CI_CD打包方案.md) 了解如何配置GitHub Actions自动打包。

手动打包：
```bash
cd packages/desktop
pnpm build
# 安装包在 release/ 目录
```

### Mobile发布

#### 使用EAS Build
```bash
cd packages/mobile

# 构建Android APK
eas build --platform android --profile preview

# 构建iOS
eas build --platform ios --profile preview
```

### Miniapp发布

```bash
cd packages/miniapp
pnpm build

# 使用微信开发者工具上传
```

---

## 🎨 自定义开发

### 添加新功能

1. **定义类型** - `packages/shared/src/types/index.ts`
2. **创建API** - `packages/backend/src/app/api/`
3. **开发UI** - 在各端的 `src/` 目录下开发

### 修改数据库Schema

```bash
cd packages/backend

# 1. 修改Schema
vim drizzle/migrations/schema.ts

# 2. 生成迁移
pnpm db:dev:generate

# 3. 应用迁移
pnpm db:dev:push
```

### 添加新的共享配置

在 `packages/shared/src/constants/index.ts` 中添加：

```typescript
export const MY_CONFIG = {
  // 你的配置
}

// 添加到统一导出
export const APP_CONSTANTS = {
  ...APP_CONFIG,
  myConfig: MY_CONFIG,
}
```

然后重新构建shared包：
```bash
cd packages/shared
pnpm build
```

---

## 🔍 故障排查

### 常见问题

#### Q1: shared包修改后没有生效？

**解决**：重新构建shared包
```bash
cd packages/shared
pnpm build
```

#### Q2: 数据库连接失败？

**解决**：启动PostgreSQL
```bash
# 使用Docker
docker start lyricnote-postgres

# 或查看详细指南
cat 数据库问题解决方案.md
```

#### Q3: 端口被占用？

**解决**：查找并关闭占用端口的进程
```bash
lsof -ti:3000 | xargs kill -9
```

#### Q4: Desktop应用显示空白？

**解决**：
1. 重新构建shared包
2. 清理缓存：`rm -rf dist-electron node_modules/.vite`
3. 重启应用

---

## 📊 默认示例应用

本框架默认配置为 **LyricNote** - 日语音乐识别应用，作为参考实现。

你可以查看现有的实现来学习如何：
- 实现用户认证系统
- 设计数据库Schema
- 创建RESTful API
- 开发多端UI界面

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

### 开发流程

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 🌟 特别感谢

- [Next.js](https://nextjs.org/) - React框架
- [React Native](https://reactnative.dev/) - 移动端开发
- [Electron](https://www.electronjs.org/) - 桌面应用
- [Taro](https://taro.zone/) - 小程序开发
- [Drizzle ORM](https://orm.drizzle.team/) - 数据库ORM
- [Better Auth](https://www.better-auth.com/) - 认证系统

---

## 📞 支持

如有问题或需要帮助：
- 📖 查看文档：`CONFIG_GUIDE.md`、`FRAMEWORK_MIGRATION.md`
- 💬 提交Issue：[GitHub Issues](your-repo-url/issues)
- 📧 联系邮箱：your-email@example.com

---

<div align="center">

**🎉 现在开始构建你的多端应用吧！**

Made with ❤️ by Your Team

</div>
