# Desktop 应用快速开始

## ✅ 已创建完成

Electron 桌面应用已完整创建，包括：

- ✅ TypeScript 配置
- ✅ Vite 构建配置
- ✅ Electron 主进程和预加载脚本
- ✅ React UI（与 RN/小程序一致）
- ✅ API 服务层（完全复刻 RN/小程序）
- ✅ 登录/注册页面
- ✅ 首页集成
- ✅ 统一的紫色渐变设计

## 📦 安装依赖

由于 Electron 下载较慢，可以尝试以下方法：

### 方法一：使用淘宝镜像（推荐）

```bash
cd packages/desktop

# 设置 Electron 镜像
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# 安装依赖
pnpm install
```

### 方法二：使用 npm

```bash
cd packages/desktop

# 设置镜像
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/

# 安装依赖
npm install
```

### 方法三：直接从根目录安装

```bash
# 回到项目根目录
cd /Users/qihongrui/Desktop/LyricNote

# 设置镜像
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# 重新安装
pnpm install
```

## 🚀 启动开发

安装成功后：

```bash
cd packages/desktop

# 启动开发模式（同时启动 Vite 和 Electron）
npm run electron:dev
```

或者分步启动：

```bash
# 终端 1：启动 Vite 开发服务器
npm run dev

# 终端 2：启动 Electron（等 Vite 启动后）
npx electron .
```

## 📦 构建应用

```bash
# 构建桌面安装包
npm run electron:build
```

构建产物在 `release/` 目录：
- macOS: `.dmg` 文件
- Windows: `.exe` 安装程序
- Linux: `.AppImage` 文件

## 🎯 功能对比

| 功能 | RN | 小程序 | Desktop |
|------|-----|--------|---------|
| 登录/注册 | ✅ | ✅ | ✅ |
| Token 管理 | ✅ | ✅ | ✅ |
| 用户信息 | ✅ | ✅ | ✅ |
| 首页集成 | ✅ | ✅ | ✅ |
| API 服务 | ✅ | ✅ | ✅ |
| 紫色渐变 | ✅ | ✅ | ✅ |

**完全一致的登录体验！**

## 📁 项目结构

```
packages/desktop/
├── electron/                 # Electron 主进程
│   ├── main.ts              # 主进程入口
│   └── preload.ts           # 预加载脚本
├── src/
│   ├── components/          # 组件
│   │   └── Layout.tsx       # 侧边栏布局
│   ├── pages/               # 页面
│   │   ├── HomePage.tsx     # 首页（显示登录状态）
│   │   └── ProfilePage.tsx  # Profile 页面（登录/注册）
│   ├── services/            # 服务
│   │   └── api.ts           # API 服务（与 RN/小程序一致）
│   ├── styles/              # 样式
│   │   └── index.css        # 全局 CSS
│   ├── App.tsx              # 路由配置
│   └── main.tsx             # React 入口
├── index.html               # HTML 模板
├── package.json
├── tsconfig.json
└── vite.config.ts           # Vite 配置
```

## 🎨 UI 特性

### 侧边栏导航

- 紫色渐变背景
- 🏠 首页
- 👤 我的

### Profile 页面

**未登录状态：**
- 切换式登录/注册表单
- 表单验证
- 友好的错误提示

**已登录状态：**
- 圆形头像（用户名首字母）
- 用户名和邮箱
- 角色徽章
- 退出登录按钮

### 首页

- 欢迎信息
- 登录状态提示
- 个性化问候（已登录用户）

## 🔧 技术栈

- **Electron 28** - 桌面框架
- **React 18** - UI 框架
- **TypeScript 5** - 类型系统
- **Vite 5** - 构建工具
- **React Router 6** - 路由
- **localStorage** - 数据持久化

## 🌐 API 配置

API 地址在 `src/services/api.ts` 中：

```typescript
const API_BASE_URL = 'http://localhost:3000/api'
```

确保后端服务已启动：

```bash
cd packages/backend
npm run dev
```

## 🎉 开始使用

1. **安装依赖**（使用上述方法）
2. **启动后端**
   ```bash
   cd packages/backend
   npm run dev
   ```
3. **启动桌面应用**
   ```bash
   cd packages/desktop
   npm run electron:dev
   ```
4. **测试登录功能**
   - 点击侧边栏"我的"
   - 注册或登录
   - 返回首页查看欢迎信息

## 💡 开发提示

- **热重载**：修改 React 代码会自动刷新
- **DevTools**：开发模式自动打开
- **调试**：可以使用 Chrome DevTools
- **日志**：查看终端输出

## 📝 下一步

- [ ] 添加音乐识别功能
- [ ] 集成歌词显示
- [ ] 添加播放器控制
- [ ] 实现文件拖放
- [ ] 添加系统托盘图标
- [ ] 实现自动更新

---

**与 RN 和小程序完全一致的桌面应用！** 🎊

