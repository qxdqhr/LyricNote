# 📜 Backend 脚本命令指南

## 🚀 开发命令

### 启动后台管理系统
```bash
pnpm dev
```
- 启动 Next.js 开发服务器
- 访问：`http://localhost:3000`
- 管理后台：`http://localhost:3000/admin`
- 热更新自动刷新

### 启动移动端
```bash
pnpm mobile:dev
```
- 从 backend 目录启动移动端开发服务器
- 等同于在 `packages/mobile` 运行 `pnpm start`
- 会打开 Expo 开发工具

### 启动小程序
```bash
pnpm miniapp:dev
```
- 从 backend 目录启动小程序开发
- 等同于在 `packages/miniapp` 运行 `pnpm dev`
- 编译到 `packages/miniapp/dist`，使用微信开发者工具打开

## 🗄️ 数据库命令

### 开发环境数据库

#### 生成迁移文件
```bash
pnpm db:dev:generate
```
- 使用 `.env.local` 配置
- 根据 schema 变更生成迁移 SQL
- 文件保存在 `drizzle/migrations/`

#### 推送到数据库
```bash
pnpm db:dev:push
```
- 使用 `.env.local` 配置
- 直接将 schema 更改推送到开发数据库
- ⚠️ 会覆盖现有表结构

### 生产环境数据库

#### 生成迁移文件
```bash
pnpm db:prod:generate
```
- 使用 `.env.production` 配置
- 生成生产环境迁移文件
- 建议在部署前生成

#### 推送到数据库
```bash
pnpm db:prod:push
```
- 使用 `.env.production` 配置
- 将 schema 推送到生产数据库
- ⚠️ 谨慎使用，可能导致数据丢失

## 📦 构建和部署

### 构建生产版本
```bash
pnpm build
```
- 构建优化的生产版本
- 输出到 `.next` 目录

### 启动生产服务器
```bash
pnpm start
```
- 启动生产模式服务器
- 需要先运行 `pnpm build`

## 🔍 代码质量

### 代码检查
```bash
pnpm lint
```
- 运行 ESLint 检查代码质量
- 自动检测代码规范问题

## 📋 常用工作流

### 本地开发流程

1. **首次启动**
   ```bash
   # 1. 生成数据库表
   pnpm db:dev:generate
   pnpm db:dev:push
   
   # 2. 启动后台系统
   pnpm dev
   
   # 3. 另开终端，启动移动端
   pnpm mobile:dev
   
   # 4. 或启动小程序（再开一个终端）
   pnpm miniapp:dev
   ```

2. **修改数据库 Schema**
   ```bash
   # 1. 修改 drizzle/migrations/schema.ts
   
   # 2. 生成迁移
   pnpm db:dev:generate
   
   # 3. 应用到数据库
   pnpm db:dev:push
   
   # 4. 重启服务
   pnpm dev
   ```

3. **部署到生产环境**
   ```bash
   # 1. 生成生产迁移
   pnpm db:prod:generate
   
   # 2. 构建项目
   pnpm build
   
   # 3. 应用数据库迁移
   pnpm db:prod:push
   
   # 4. 启动生产服务器
   pnpm start
   ```

## 🔧 环境配置文件

| 环境 | 配置文件 | 数据库命令前缀 |
|------|---------|---------------|
| **开发环境** | `.env.local` | `db:dev:*` |
| **生产环境** | `.env.production` | `db:prod:*` |

## ⚠️ 注意事项

### 数据库操作
- ✅ **开发环境** 可以随意使用 `push`
- ⚠️ **生产环境** 务必先 `generate` 检查迁移文件
- ❌ 生产环境避免直接 `push`，优先使用 `migrate`

### 移动端开发
- 确保已安装 Expo CLI：`npm install -g @expo/cli`
- 首次启动可能需要安装依赖
- 需要 Expo Go 应用（iOS/Android）扫码测试

## 🆘 常见问题

### Q: 数据库推送失败？
```bash
# 检查环境变量
cat .env.local

# 检查数据库连接
psql $DATABASE_URL
```

### Q: 移动端启动失败？
```bash
# 进入移动端目录手动启动
cd ../mobile
pnpm install
pnpm start
```

### Q: 端口被占用？
```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

## 📚 相关文档

- [项目总览](../../README.md)
- [移动端认证设置](../mobile/AUTH_SETUP.md)
- [部署指南](../../docs/deployment.md)

---

💡 **提示**：建议将常用命令添加到你的 shell 别名中，提高开发效率！

