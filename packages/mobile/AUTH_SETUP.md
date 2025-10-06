# 📱 移动端认证功能设置指南

## 🎯 功能概述

已完成的移动端认证功能：
- ✅ 用户注册
- ✅ 用户登录
- ✅ 自动保持登录状态
- ✅ 用户信息展示
- ✅ 退出登录
- ✅ 与后台管理员登录共享认证逻辑

## 📦 安装依赖

```bash
cd packages/mobile

# 使用 pnpm
pnpm install

# 或使用 expo
npx expo install @react-native-async-storage/async-storage
```

## 🔧 配置 API 地址

### 方式一：使用环境变量（推荐）

创建 `.env` 文件：

```bash
# packages/mobile/.env
EXPO_PUBLIC_API_URL=http://your-server-ip:3000/api
```

本地开发示例：
```bash
# iOS 模拟器
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Android 模拟器
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# 真机测试（替换为你的电脑 IP）
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api

# 生产环境
EXPO_PUBLIC_API_URL=https://api.lyricnote.com/api
```

### 方式二：直接修改代码

编辑 `src/services/api.ts`：

```typescript
const API_BASE_URL = 'http://your-server-ip:3000/api';
```

## 🚀 启动应用

```bash
cd packages/mobile

# 启动开发服务器
pnpm start

# 或直接启动到设备
pnpm ios      # iOS 模拟器
pnpm android  # Android 模拟器
```

## 🔐 认证流程

### 后端 API 接口

所有接口都在后台系统中：

1. **注册** - `POST /api/users`
   ```json
   {
     "email": "user@example.com",
     "username": "username",
     "password": "password123"
   }
   ```

2. **登录** - `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **获取用户信息** - `GET /api/auth/me`
   - Header: `Authorization: Bearer <token>`

4. **登出** - `POST /api/auth/logout`
   - Header: `Authorization: Bearer <token>`

### 前端使用方式

```typescript
import { apiService } from '@/services/api';

// 注册
const response = await apiService.register(email, password, username);

// 登录
const response = await apiService.login(email, password);

// 获取当前用户
const response = await apiService.getCurrentUser();

// 登出
const response = await apiService.logout();

// 检查登录状态
const isAuth = await apiService.isAuthenticated();
```

## 📱 界面功能

### "我的"页面 (ProfileScreen)

**未登录状态：**
- 切换登录/注册模式
- 输入邮箱、密码（注册还需输入用户名）
- 提交登录/注册

**已登录状态：**
- 显示用户头像（首字母）
- 显示用户名和邮箱
- 显示用户角色（普通用户/管理员/超级管理员）
- 退出登录按钮

## 🔄 与管理后台共享认证

认证逻辑使用相同的 `DrizzleAuthService`：

### 管理后台登录
- 路径：`/admin/login`
- 要求：角色必须是 `ADMIN` 或 `SUPER_ADMIN`
- 使用：`/api/auth/login` 接口

### 移动端登录
- 页面：ProfileScreen
- 角色：任何角色都可以登录
- 使用：`/api/auth/login` 接口

### Token 存储
- **管理后台**：存储在浏览器 localStorage
- **移动端**：存储在 AsyncStorage

## 🧪 测试步骤

### 1. 启动后端服务

```bash
cd packages/backend
npm run dev
```

后端运行在 `http://localhost:3000`

### 2. 启动移动端

```bash
cd packages/mobile
npm start
```

### 3. 测试注册

1. 点击"我的" tab
2. 切换到"注册"
3. 输入：
   - 用户名：testuser
   - 邮箱：test@example.com
   - 密码：test123456
4. 点击"注册"按钮

### 4. 测试登录

1. 退出登录
2. 切换到"登录"
3. 输入注册的邮箱和密码
4. 点击"登录"按钮

### 5. 测试自动登录

1. 关闭应用
2. 重新打开应用
3. 应该自动保持登录状态

## 🐛 常见问题

### 1. 网络请求失败

**问题**：无法连接到后端服务器

**解决方案**：
- 检查后端服务是否启动：`curl http://localhost:3000/api/health`
- iOS 模拟器使用：`http://localhost:3000/api`
- Android 模拟器使用：`http://10.0.2.2:3000/api`
- 真机使用：电脑的局域网 IP，如 `http://192.168.1.100:3000/api`

### 2. AsyncStorage 错误

**问题**：找不到 AsyncStorage 模块

**解决方案**：
```bash
npx expo install @react-native-async-storage/async-storage
```

### 3. Token 无效

**问题**：登录后立即提示未登录

**解决方案**：
- 清除应用数据重新登录
- 检查后端 JWT_SECRET 配置
- 查看后端日志确认 token 生成

### 4. 跨域问题（Web 版本）

如果在 web 上运行，可能遇到 CORS 问题。

**解决方案**：在后端添加 CORS 配置。

## 📚 相关文件

### 后端
- `packages/backend/src/app/api/(common)/auth/login/route.ts` - 登录接口
- `packages/backend/src/app/api/(common)/auth/logout/route.ts` - 登出接口
- `packages/backend/src/app/api/(common)/auth/me/route.ts` - 获取用户信息
- `packages/backend/src/app/api/(common)/users/route.ts` - 用户注册
- `packages/backend/src/lib/auth/drizzle-auth.ts` - 认证服务

### 移动端
- `packages/mobile/src/services/api.ts` - API 服务
- `packages/mobile/src/screens/ProfileScreen.tsx` - 我的页面
- `packages/mobile/src/navigation/TabNavigator.tsx` - Tab 导航

## 🎉 完成

现在你的移动端已经具备完整的认证功能，可以：
- ✅ 注册新用户
- ✅ 登录现有用户
- ✅ 自动保持登录
- ✅ 安全退出登录
- ✅ 与后台共享认证逻辑

