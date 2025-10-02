# 🔍 端口检查工具使用指南

## 📋 概述

LyricNote 项目提供了两个端口检查脚本，帮助你快速查看和管理端口占用情况。

## 🚀 快速检查

### 使用 `quick-ports.sh`
```bash
# 快速查看项目相关端口
./scripts/quick-ports.sh
```

**输出示例：**
```
🚀 快速端口检查
====================
● 3000 - node(37765)     # 被占用
● 3004 - node(17823)     # 被占用  
○ 6379 - 空闲            # 空闲
○ 8080 - 空闲            # 空闲
```

## 🔧 详细检查

### 使用 `check-ports.sh`

#### 1. 基本用法
```bash
# 检查项目默认端口
./scripts/check-ports.sh

# 检查指定端口
./scripts/check-ports.sh 3000 5432 6379

# 显示帮助
./scripts/check-ports.sh --help
```

#### 2. 高级功能
```bash
# 显示所有监听端口
./scripts/check-ports.sh --all

# 只显示项目相关端口
./scripts/check-ports.sh --project

# 交互式终止进程
./scripts/check-ports.sh --kill 3000

# 显示端口统计信息
./scripts/check-ports.sh --all
```

## 📊 功能对比

| 功能 | quick-ports.sh | check-ports.sh |
|------|----------------|----------------|
| 快速检查 | ✅ | ✅ |
| 详细信息 | ❌ | ✅ |
| 自定义端口 | ❌ | ✅ |
| 终止进程 | ❌ | ✅ |
| 所有端口 | ❌ | ✅ |
| 统计信息 | ❌ | ✅ |

## 🎯 LyricNote 项目端口

### 开发环境端口
- **3000**: Next.js 开发服务器（默认）
- **3001**: Next.js 开发服务器（备用）
- **3004**: Next.js 开发服务器（当前使用）
- **19000-19002**: Expo 开发服务器

### 数据库端口
- **5432**: PostgreSQL 数据库（本地开发）
- **5433**: PostgreSQL 数据库（生产环境）
- **6379**: Redis 缓存服务器

### 其他服务端口
- **8080**: HTTP 服务（通用）
- **8081**: HTTP 服务（备用）

## 🛠️ 常见操作

### 1. 查找占用特定端口的进程
```bash
# 方法1: 使用脚本
./scripts/check-ports.sh 3000

# 方法2: 直接使用系统命令
lsof -i :3000
```

### 2. 终止占用端口的进程
```bash
# 交互式终止（推荐）
./scripts/check-ports.sh --kill 3000

# 直接终止（谨慎使用）
kill -9 $(lsof -ti :3000)
```

### 3. 查看所有网络连接
```bash
# 使用脚本
./scripts/check-ports.sh --all

# 直接使用系统命令
netstat -tulnp
```

### 4. 监控端口变化
```bash
# 持续监控（每2秒刷新）
watch -n 2 './scripts/quick-ports.sh'
```

## 🔍 故障排除

### 常见问题

1. **端口被占用无法启动服务**
   ```bash
   # 查看占用情况
   ./scripts/check-ports.sh 3000
   
   # 终止占用进程
   ./scripts/check-ports.sh --kill 3000
   ```

2. **找不到监听端口**
   ```bash
   # 检查服务是否启动
   ./scripts/check-ports.sh --all | grep 3000
   
   # 检查进程状态
   ps aux | grep node
   ```

3. **权限不足无法终止进程**
   ```bash
   # 使用 sudo（谨慎）
   sudo ./scripts/check-ports.sh --kill 3000
   
   # 或者找到进程所有者
   ps -ef | grep 3000
   ```

### 脚本权限问题
```bash
# 添加执行权限
chmod +x scripts/check-ports.sh
chmod +x scripts/quick-ports.sh
```

## 📝 输出说明

### 端口状态标识
- 🔴 **● 端口号** - 端口被占用
- 🟢 **○ 端口号** - 端口空闲

### 进程信息格式
```
PID: 12345 | 进程: node | 地址: *:3000
```
- **PID**: 进程ID
- **进程**: 进程名称
- **地址**: 监听地址

### 协议类型
- **TCP**: 传输控制协议（大多数Web服务）
- **UDP**: 用户数据报协议（DNS、DHCP等）

## 🚀 集成到开发流程

### 1. 启动开发环境前检查
```bash
# 检查端口占用
./scripts/quick-ports.sh

# 如有冲突，清理端口
./scripts/check-ports.sh --kill 3000

# 启动开发服务
npm run dev
```

### 2. 添加到 package.json
```json
{
  "scripts": {
    "check-ports": "./scripts/quick-ports.sh",
    "check-ports-detail": "./scripts/check-ports.sh",
    "kill-port": "./scripts/check-ports.sh --kill"
  }
}
```

### 3. 自动化脚本
```bash
#!/bin/bash
# 自动清理并启动开发环境

echo "🔍 检查端口占用..."
./scripts/quick-ports.sh

echo "🧹 清理开发端口..."
./scripts/check-ports.sh --kill 3000 3004 19000

echo "🚀 启动开发服务..."
npm run dev
```

## 💡 提示

1. **定期检查**: 开发过程中定期运行 `quick-ports.sh` 检查端口状态
2. **谨慎终止**: 使用 `--kill` 选项前确认进程不是重要系统服务
3. **端口规划**: 为不同服务分配固定端口，避免冲突
4. **文档更新**: 新增服务端口时更新脚本中的端口列表

---

🔧 **需要帮助？** 运行 `./scripts/check-ports.sh --help` 查看完整选项列表。
