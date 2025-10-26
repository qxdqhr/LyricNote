#!/bin/bash

# 全平台 Tailwind CSS 一键配置脚本
# 使用方法: bash scripts/setup-tailwind-all.sh

set -e

echo "🎨 ============================================"
echo "🎨  LyricNote - 全平台 Tailwind CSS 配置"
echo "🎨 ============================================"
echo ""

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed"
    exit 1
fi

# 进入项目根目录
cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo "${BLUE}📦 当前目录: ${ROOT_DIR}${NC}"
echo ""

# ==================== Desktop ====================
echo "${YELLOW}📦 [1/3] 配置 Desktop (Electron + Vite)...${NC}"
cd "${ROOT_DIR}/packages/desktop"

# 安装依赖（Tailwind CSS v4 需要 @tailwindcss/postcss）
echo "  → 安装 Tailwind CSS v4 依赖..."
pnpm add -D tailwindcss @tailwindcss/postcss autoprefixer

# 创建 Tailwind 配置
echo "  → 创建 tailwind.config.js..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B8AFF',
        secondary: '#FF6B9D',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
EOF

# 创建 PostCSS 配置（v4 使用 @tailwindcss/postcss）
echo "  → 创建 postcss.config.js..."
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOF

# 创建 CSS 入口文件（v4 使用 @import 语法）
echo "  → 创建 src/styles/index.css..."
mkdir -p src/styles
cat > src/styles/index.css << 'EOF'
@import "tailwindcss";

/* 自定义全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
EOF

echo "${GREEN}  ✅ Desktop 配置完成${NC}"
echo ""

# ==================== Mobile ====================
echo "${YELLOW}📱 [2/3] 配置 Mobile (React Native + NativeWind)...${NC}"
cd "${ROOT_DIR}/packages/mobile"

# 安装依赖
echo "  → 安装 NativeWind 依赖..."
pnpm add nativewind
pnpm add -D tailwindcss

# 创建 Tailwind 配置
echo "  → 创建 tailwind.config.js..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B8AFF',
        secondary: '#FF6B9D',
      },
    },
  },
  plugins: [],
}
EOF

# 更新 babel 配置
echo "  → 更新 babel.config.js..."
if [ -f babel.config.js ]; then
  # 备份原文件
  cp babel.config.js babel.config.js.backup

  # 添加 nativewind plugin
  cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
EOF
fi

# 创建 TypeScript 类型文件
echo "  → 创建 nativewind-env.d.ts..."
cat > nativewind-env.d.ts << 'EOF'
/// <reference types="nativewind/types" />
EOF

echo "${GREEN}  ✅ Mobile 配置完成${NC}"
echo ""

# ==================== MiniApp ====================
echo "${YELLOW}🏪 [3/3] 配置 MiniApp (Taro + weapp-tailwindcss)...${NC}"
cd "${ROOT_DIR}/packages/miniapp"

# 安装依赖
echo "  → 安装 weapp-tailwindcss 依赖..."
pnpm add -D weapp-tailwindcss tailwindcss postcss autoprefixer postcss-rem-to-responsive-pixel

# 创建 Tailwind 配置
echo "  → 创建 tailwind.config.js..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B8AFF',
        secondary: '#FF6B9D',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 小程序不需要重置样式
  },
}
EOF

# 创建 PostCSS 配置
echo "  → 创建 postcss.config.js..."
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-rem-to-responsive-pixel': {
      rootValue: 32,
      propList: ['*'],
      transformUnit: 'rpx',
    },
  },
}
EOF

# 更新 app.css
echo "  → 更新 src/app.css..."
if [ -f src/app.css ]; then
  # 备份
  cp src/app.css src/app.css.backup
fi

cat > src/app.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 小程序全局样式 */
page {
  @apply bg-gray-50 text-gray-900;
}
EOF

echo "${GREEN}  ✅ MiniApp 配置完成${NC}"
echo ""

# ==================== 总结 ====================
echo "${GREEN}============================================${NC}"
echo "${GREEN}  🎉 所有平台 Tailwind CSS 配置完成！${NC}"
echo "${GREEN}============================================${NC}"
echo ""
echo "📋 下一步操作："
echo ""
echo "1. Desktop (Electron + Tailwind v4):"
echo "   cd packages/desktop"
echo "   # 在 src/main.tsx 中导入: import './styles/index.css'"
echo "   pnpm dev"
echo ""
echo "2. Mobile (React Native + NativeWind):"
echo "   cd packages/mobile"
echo "   # 重新启动项目以应用 Babel 配置"
echo "   pnpm start --clear"
echo ""
echo "3. MiniApp (Taro + weapp-tailwindcss):"
echo "   cd packages/miniapp"
echo "   # 更新 config/index.ts 添加 webpack 插件"
echo "   # 参考: docs/TAILWIND_SETUP_ALL_PLATFORMS.md"
echo "   pnpm dev:weapp"
echo ""
echo "⚠️  重要提示："
echo "   - Desktop 使用 Tailwind CSS v4 (需要 @tailwindcss/postcss)"
echo "   - Backend 使用 Tailwind CSS v4 (Next.js)"
echo "   - Mobile 使用 NativeWind 3.x (基于 Tailwind v3)"
echo "   - MiniApp 使用 weapp-tailwindcss (基于 Tailwind v3)"
echo ""
echo "📚 详细文档: docs/TAILWIND_SETUP_ALL_PLATFORMS.md"
echo ""


