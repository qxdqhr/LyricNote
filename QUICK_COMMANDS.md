# ⚡ LyricNote 快速命令参考

## 🚀 一键启动开发环境

### 方式一：分别启动（推荐）

**终端 1 - 启动后台系统：**
```bash
cd packages/backend
pnpm dev
```
访问：http://localhost:3000

**终端 2 - 启动移动端：**
```bash
cd packages/backend
pnpm mobile:dev
```
或者
```bash
cd packages/mobile
pnpm start
```

### 方式二：从 backend 启动移动端/小程序
```bash
cd packages/backend
pnpm dev          # 终端 1：后台系统
pnpm mobile:dev   # 终端 2：移动端（React Native）
pnpm miniapp:dev  # 终端 3：小程序（微信）
```

## 📊 数据库快速命令

| 操作 | 开发环境 | 生产环境 |
|-----|---------|----------|
| **生成迁移** | `pnpm db:dev:generate` | `pnpm db:prod:generate` |
| **推送到数据库** | `pnpm db:dev:push` | `pnpm db:prod:push` |

> 💡 在 `packages/backend` 目录下运行

## 🏃 开发流程速查

### 首次设置
```bash
# 1. 安装依赖（在项目根目录）
pnpm install

# 2. 初始化数据库
cd packages/backend
pnpm db:dev:generate
pnpm db:dev:push

# 3. 启动服务
pnpm dev              # 后台系统
pnpm mobile:dev       # 移动端
```

### 日常开发
```bash
# 后台开发
cd packages/backend
pnpm dev

# 移动端开发 (React Native)
cd packages/mobile
pnpm start

# 小程序开发 (微信)
cd packages/miniapp
pnpm dev

# 修改数据库后
cd packages/backend
pnpm db:dev:generate
pnpm db:dev:push
```

## 📱 测试账户

### 管理后台
- 地址：http://localhost:3000/admin/login
- 邮箱：`admin@lyricnote.local`
- 密码：`admin123`

### 移动端
- 需要先注册或使用已有账户登录

## 🔗 常用链接

| 服务 | 地址 |
|------|------|
| **后台系统** | http://localhost:3000 |
| **管理后台** | http://localhost:3000/admin |
| **API 接口** | http://localhost:3000/api |
| **移动端** | Expo 开发工具 |

## 📝 其他命令

```bash
# 代码检查
pnpm lint

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

---

💡 **提示**：将此文件保存到书签，快速查询常用命令！

