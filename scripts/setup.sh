#!/bin/bash

# LyricNote Monorepo 项目设置脚本
echo "🎌 Setting up LyricNote Monorepo..."

# 检查 Node.js 版本
echo "📋 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# 安装根目录依赖
echo "📦 Installing root dependencies..."
npm install

# 构建共享包
echo "🔨 Building shared package..."
npm run build:shared

# 初始化后端数据库（如果配置了数据库）
if [ -f "packages/backend/.env" ]; then
    echo "🗄️ Setting up database..."
    npm run db:generate
    npm run db:push
    npm run db:seed
else
    echo "⚠️ Backend .env file not found. Please copy packages/backend/env.example to packages/backend/.env and configure it."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📚 Next steps:"
echo "  1. Configure backend environment: cp packages/backend/env.example packages/backend/.env"
echo "  2. Start development: npm run dev"
echo "  3. Access admin panel: http://localhost:3000/admin"
echo "  4. Default admin: admin@lyricnote.com / admin123456"
echo ""
echo "🚀 Happy coding!"
