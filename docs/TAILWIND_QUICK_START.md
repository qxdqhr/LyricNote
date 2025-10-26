# Tailwind CSS 快速配置指南

## 🚀 一键配置所有平台

```bash
# 在项目根目录执行
bash scripts/setup-tailwind-all.sh
```

这将自动配置：

- ✅ Desktop (Electron)
- ✅ Mobile (React Native + NativeWind)
- ✅ MiniApp (Taro + weapp-tailwindcss)
- ✅ Backend (已完成)

---

## 📦 各平台状态

| 平台        | 状态              | 方案              |
| ----------- | ----------------- | ----------------- |
| **Backend** | ✅ 已完成         | Tailwind CSS      |
| **Desktop** | 🔨 运行脚本后配置 | Tailwind CSS      |
| **Mobile**  | 🔨 运行脚本后配置 | NativeWind        |
| **MiniApp** | 🔨 运行脚本后配置 | weapp-tailwindcss |

---

## 🎯 配置后的步骤

### 1. Desktop

```bash
cd packages/desktop

# 在 src/main.tsx 中添加：
# import './index.css';

pnpm dev
```

### 2. Mobile

```bash
cd packages/mobile

# 重新启动以应用 Babel 配置
pnpm start --clear
```

### 3. MiniApp

需要手动配置 Webpack 插件：

```javascript
// config/index.ts
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';

const config = {
  mini: {
    webpackChain(chain) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: 'taro',
              },
            ],
          },
        },
      });
    },
  },
};
```

然后：

```bash
cd packages/miniapp
pnpm dev:weapp
```

---

## 📝 使用示例

所有平台使用相同的 Tailwind 语法：

```tsx
// Backend, Desktop
<div className="bg-white dark:bg-gray-800 rounded-lg p-4">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello Tailwind!
  </h1>
</div>

// Mobile (NativeWind)
<View className="bg-white rounded-lg p-4">
  <Text className="text-2xl font-bold text-gray-900">
    Hello Tailwind!
  </Text>
</View>

// MiniApp (Taro)
<View className="bg-white rounded-lg p-4">
  <Text className="text-2xl font-bold text-gray-900">
    Hello Tailwind!
  </Text>
</View>
```

---

## 💡 共享配置

创建共享的颜色方案：

```javascript
// 所有平台的 tailwind.config.js 都包含
theme: {
  extend: {
    colors: {
      primary: '#5B8AFF',
      secondary: '#FF6B9D',
    },
  },
}
```

使用：

```tsx
<div className="bg-primary text-white">统一的主题色</div>
```

---

## 📚 详细文档

- [完整配置指南](./TAILWIND_SETUP_ALL_PLATFORMS.md) - 详细的每个平台配置步骤
- [语言切换器](../packages/backend/src/components/language-switcher/README.md) -
  Tailwind 版本组件示例

---

## 🎉 完成后的效果

- ✅ 所有 4 个平台使用统一的 Tailwind CSS 语法
- ✅ 自动支持深色模式
- ✅ 响应式设计开箱即用
- ✅ 更小的打包体积
- ✅ 更好的开发体验

---

**快速开始**: `bash scripts/setup-tailwind-all.sh`
