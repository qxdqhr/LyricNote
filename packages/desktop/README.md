# LyricNote Desktop

LyricNote 的 Electron 桌面应用，使用 TypeScript + React + Vite 构建。

## ✨ 特性

- 🎯 **TypeScript** - 类型安全
- ⚡️ **Vite** - 极速开发体验
- ⚛️ **React** - 现代 UI 框架
- 🔐 **登录系统** - 与 RN/小程序完全一致的登录逻辑
- 🎨 **统一设计** - 紫色渐变品牌色，与其他平台视觉一致
- 💾 **本地存储** - localStorage 持久化用户数据
- 🌐 **API 集成** - 完整的后端 API 对接

## 📦 安装依赖

```bash
cd packages/desktop
npm install
```

## 🚀 开发

```bash
# 启动开发模式
npm run electron:dev
```

这会同时启动 Vite 开发服务器和 Electron 窗口。

## 📦 构建

```bash
# 构建桌面应用
npm run electron:build
```

构建产物在 `release/` 目录。

## 📁 项目结构

```
packages/desktop/
├── electron/              # Electron 主进程
│   ├── main.ts           # 主进程入口
│   └── preload.ts        # 预加载脚本
├── src/
│   ├── components/       # React 组件
│   │   └── Layout.tsx    # 布局组件
│   ├── pages/           # 页面
│   │   ├── HomePage.tsx  # 首页
│   │   └── ProfilePage.tsx # Profile 页面（登录/注册）
│   ├── services/        # 服务层
│   │   └── api.ts       # API 服务（与 RN/小程序一致）
│   ├── styles/          # 样式
│   │   └── index.css    # 全局样式
│   ├── App.tsx          # 应用根组件
│   └── main.tsx         # React 入口
├── index.html           # HTML 模板
├── package.json
├── tsconfig.json
└── vite.config.ts       # Vite 配置
```

## 🎯 核心功能

### 1. API 服务层 (`src/services/api.ts`)

完全复刻 RN 和小程序的 API 设计：

- Token 管理（localStorage）
- 自动注入认证头
- 用户数据缓存
- 完整的认证 API

### 2. 登录系统

**Profile 页面** 提供完整的登录/注册功能：

- ✅ 登录/注册切换
- ✅ 表单验证
- ✅ 自动登录状态检查
- ✅ Token 持久化
- ✅ 用户信息展示
- ✅ 退出登录

### 3. 首页集成

首页会自动：
- 检查登录状态
- 显示欢迎信息（已登录）
- 显示登录提示（未登录）

## 🎨 设计规范

### 配色方案

- **主色调**：紫色渐变 `#8b5cf6` → `#6366f1`
- **背景色**：`#f9fafb`
- **文字颜色**：
  - 标题：`#111827`
  - 正文：`#6b7280`
- **成功色**：绿色
- **错误色**：`#ef4444`

### 布局

- **侧边栏**：240px 宽，紫色渐变背景
- **主内容区**：自适应宽度
- **最小窗口**：800x600
- **推荐窗口**：1200x800

## 🔧 技术栈

- **Electron** - 桌面应用框架
- **React 18** - UI 框架
- **TypeScript** - 类型系统
- **Vite** - 构建工具
- **React Router** - 路由管理
- **localStorage** - 本地存储

## 📝 与其他平台的对应关系

| 功能 | RN | 小程序 | Desktop | 技术 |
|------|-----|--------|---------|------|
| API 服务 | ✅ | ✅ | ✅ | 单例模式 |
| Token 管理 | AsyncStorage | Taro.Storage | localStorage | 持久化 |
| 登录/注册 | ProfileScreen | Profile 页面 | ProfilePage | 完全一致 |
| 首页集成 | HomeScreen | Index 页面 | HomePage | 完全一致 |
| 路由 | React Navigation | TabBar | React Router | 不同实现 |

## 🚨 注意事项

1. **后端服务**：需要先启动后端服务
   ```bash
   cd packages/backend
   npm run dev
   ```

2. **API 地址**：默认 `http://localhost:3000/api`，可在 `src/services/api.ts` 中修改

3. **开发工具**：开发模式会自动打开 DevTools

## 🎉 特色功能

- **自动更新**（可配置）
- **原生体验**（隐藏标题栏）
- **跨平台**（macOS、Windows、Linux）
- **热重载**（开发模式）

## 📚 下一步

- [ ] 添加音乐识别功能
- [ ] 集成歌词显示
- [ ] 添加播放控制
- [ ] 实现文件拖放
- [ ] 添加系统托盘

---

**与 RN 和小程序保持完全一致的登录体验！** 🎊

