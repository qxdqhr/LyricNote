#!/bin/bash

# LyricNote 开发启动脚本
echo "🎌 Starting LyricNote development servers..."

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
fi

# 检查共享包是否已构建
if [ ! -d "packages/shared/dist" ]; then
    echo "🔨 Building shared package..."
    npm run build:shared
fi

# 检查后端环境配置
if [ ! -f "packages/backend/.env" ]; then
    echo "⚠️ Backend .env file not found."
    echo "📝 Copying environment template..."
    cp packages/backend/env.example packages/backend/.env
    echo "✏️ Please edit packages/backend/.env to configure your database and other settings."
fi

echo ""
echo "🚀 Starting development servers..."
echo "📱 Mobile app will be available at: http://localhost:8081"
echo "🌐 Backend API will be available at: http://localhost:3000"
echo "🔧 Admin panel will be available at: http://localhost:3000/admin"
echo ""
echo "⏹️ Press Ctrl+C to stop all servers"
echo ""

# 启动开发服务器
npm run dev
