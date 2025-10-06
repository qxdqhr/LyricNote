# 📝 应用配置指南

本文档说明如何快速定制和配置本框架以适应不同的多端应用项目。

## 🎯 核心配置文件

所有应用级别的文案和配置都集中在 **`packages/shared/src/constants/index.ts`** 文件中。

### 主要配置项

#### 1. 应用基础信息 (`APP_CONFIG`)

```typescript
export const APP_CONFIG = {
  name: 'LyricNote',              // 应用名称
  fullName: 'LyricNote - 日语音乐识别应用',  // 应用全称
  icon: '🎌',                     // 应用图标emoji
  description: '专注日语歌曲的AI智能听歌识曲应用',  // 应用描述
  version: '1.0.0',               // 应用版本
  author: 'LyricNote Team',       // 开发团队
  copyright: `© ${new Date().getFullYear()} LyricNote`,  // 版权信息
}
```

#### 2. 应用标题文案 (`APP_TITLES`)

```typescript
export const APP_TITLES = {
  main: `${APP_CONFIG.icon} ${APP_CONFIG.name}`,  // 主标题
  admin: `${APP_CONFIG.name} 管理后台`,            // 管理后台标题
  withVersion: `${APP_CONFIG.name} v${APP_CONFIG.version}`,  // 带版本号的标题
  welcome: `欢迎使用 ${APP_CONFIG.name}`,          // 欢迎语
  about: `关于${APP_CONFIG.name}`,                // 关于页面标题
}
```

#### 3. UI文案 (`UI_TEXT`)

包含按钮、导航、状态提示、表单提示等所有UI相关文案。

```typescript
export const UI_TEXT = {
  buttons: { /* 按钮文案 */ },
  navigation: { /* 导航菜单文案 */ },
  status: { /* 状态提示 */ },
  form: { /* 表单提示 */ },
}
```

#### 4. 主题配置 (`THEME_CONFIG`)

```typescript
export const THEME_CONFIG = {
  primaryColor: '#5B8AFF',        // 主题色
  secondaryColor: '#FF6B9D',      // 辅助色
  // ... 更多颜色配置
}
```

#### 5. 业务配置 (`BUSINESS_CONFIG`)

```typescript
export const BUSINESS_CONFIG = {
  lyricModes: ['kanji', 'hiragana', 'romaji'],  // 支持的歌词模式
  defaultLyricMode: 'kanji',                    // 默认歌词模式
  pageSize: 20,                                 // 每页显示数量
  maxUploadSize: 10,                            // 最大上传文件大小(MB)
  // ... 更多业务配置
}
```

#### 6. 环境配置 (`ENV_CONFIG`)

```typescript
export const ENV_CONFIG = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
    wsUrl: 'ws://localhost:3000',
  },
  production: {
    apiUrl: 'https://api.lyricnote.app',
    wsUrl: 'wss://api.lyricnote.app',
  },
}
```

## 🚀 快速定制步骤

### 步骤 1: 修改应用基础信息

编辑 `packages/shared/src/constants/index.ts`:

```typescript
export const APP_CONFIG = {
  name: 'YourAppName',              // 改成你的应用名
  fullName: 'YourAppName - 你的应用描述',
  icon: '🎵',                        // 改成你想要的emoji
  description: '你的应用简介',
  version: '1.0.0',
  author: 'Your Team',
  copyright: `© ${new Date().getFullYear()} YourAppName`,
}
```

### 步骤 2: 更新UI文案（可选）

如果需要修改按钮、菜单等文案，在同一文件中修改 `UI_TEXT` 对象。

### 步骤 3: 调整主题色（可选）

修改 `THEME_CONFIG` 中的颜色值以匹配你的品牌色。

### 步骤 4: 重新构建shared包

```bash
cd packages/shared
npm run build
```

### 步骤 5: 测试各端应用

```bash
# 测试backend
cd packages/backend && npm run dev

# 测试mobile
cd packages/mobile && npm run dev

# 测试miniapp
cd packages/miniapp && npm run dev:weapp

# 测试desktop
cd packages/desktop && npm run dev
```

## 📦 各端的配置集成

### Backend (Next.js)

所有页面和组件都通过以下方式引用共享配置：

```typescript
import { APP_CONFIG, APP_TITLES, UI_TEXT } from '@lyricnote/shared'

// 使用示例
<h1>{APP_TITLES.admin}</h1>
<p>{APP_CONFIG.description}</p>
```

### Mobile (React Native + Expo)

```typescript
import { APP_TITLES, APP_CONFIG } from '@lyricnote/shared'

<Text>{APP_TITLES.main}</Text>
<Text>{APP_CONFIG.description}</Text>
```

### Miniapp (Taro 微信小程序)

```typescript
import { APP_CONFIG, UI_TEXT } from '@lyricnote/shared'

// 在app.config.ts中
navigationBarTitleText: APP_CONFIG.name

// 在页面组件中
<Text>{APP_TITLES.welcome}</Text>
```

### Desktop (Electron + React)

```typescript
import { APP_CONFIG, UI_TEXT } from '@lyricnote/shared'

<span className="logo-text">{APP_CONFIG.name}</span>
```

## 🔧 高级定制

### 添加新的配置项

1. 在 `packages/shared/src/constants/index.ts` 中添加新的配置对象
2. 更新 `APP_CONSTANTS` 导出
3. 在需要的地方引用使用

### 多语言支持（未来扩展）

可以在 `constants` 目录下创建多个语言文件：
- `index.ts` - 默认语言
- `en.ts` - 英文
- `ja.ts` - 日文

## 📂 项目结构

```
LyricNote/
├── packages/
│   ├── shared/                 # 共享配置和类型
│   │   └── src/
│   │       ├── constants/      # 📍 核心配置文件
│   │       │   └── index.ts
│   │       ├── types/          # TypeScript类型定义
│   │       └── utils/          # 工具函数
│   ├── backend/                # 后端服务
│   ├── mobile/                 # 移动端应用
│   ├── miniapp/                # 小程序
│   └── desktop/                # 桌面应用
```

## ✅ 配置检查清单

在发布新应用前，确保检查以下配置：

- [ ] 修改 `APP_CONFIG.name`
- [ ] 修改 `APP_CONFIG.description`
- [ ] 修改 `APP_CONFIG.icon`
- [ ] 修改 `APP_CONFIG.author`
- [ ] 更新 `THEME_CONFIG` 主题色
- [ ] 更新 `ENV_CONFIG` API地址
- [ ] 检查 `UI_TEXT` 是否需要调整
- [ ] 重新构建 shared 包
- [ ] 测试所有端的应用

## 🎨 品牌定制建议

1. **应用名称**: 简短、易记、有辨识度
2. **图标emoji**: 选择与应用主题相关的emoji
3. **主题色**: 选择符合品牌形象的颜色
4. **描述文案**: 清晰表达应用核心功能

## 🆘 常见问题

### Q: 修改配置后没有生效？
A: 确保重新构建了shared包：`cd packages/shared && npm run build`

### Q: 某个端无法识别shared包？
A: 检查该端的package.json是否正确引用了 `"@lyricnote/shared": "workspace:*"`

### Q: 如何添加更多自定义配置？
A: 直接在 `packages/shared/src/constants/index.ts` 中添加新的导出对象

## 📞 技术支持

如有问题，请查看：
- 项目README.md
- 各package的README.md
- 或提交Issue

---

🎉 **现在你可以快速将此框架定制为任何多端应用！**

