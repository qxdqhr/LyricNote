# ⚡ 微信小程序快速开始

## 🚀 5 分钟启动小程序

### 1️⃣ 安装依赖

```bash
cd packages/miniapp
pnpm install
```

### 2️⃣ 启动编译

```bash
pnpm dev
```

或从 backend 目录启动：
```bash
cd packages/backend
pnpm miniapp:dev
```

### 3️⃣ 打开微信开发者工具

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具，点击"导入项目"
3. **项目目录**: 选择 `packages/miniapp/dist`
4. **AppID**: 选择"测试号"（或使用自己的 AppID）
5. 点击"导入"

### 4️⃣ 开发设置

在微信开发者工具中：
1. 打开"详情" → "本地设置"
2. ✅ 勾选"不校验合法域名..."
3. ✅ 勾选"启用调试"

### 5️⃣ 配置 API 地址

编辑 `src/services/api.ts`：

```typescript
// 本地开发
const API_BASE_URL = 'http://localhost:3000/api'

// 真机调试（替换为你的电脑 IP）
const API_BASE_URL = 'http://192.168.1.100:3000/api'
```

> 💡 查看电脑 IP: `ifconfig`(Mac/Linux) 或 `ipconfig`(Windows)

---

## 🎯 快速测试

### 启动完整环境

**终端 1 - 后端服务**:
```bash
cd packages/backend
pnpm dev
```

**终端 2 - 小程序编译**:
```bash
cd packages/miniapp
pnpm dev
```

**微信开发者工具**:
- 导入 `packages/miniapp/dist` 目录
- 查看小程序界面

### 测试功能

1. **首页** - 查看品牌展示
2. **我的** - 测试登录/注册功能
   - 注册新用户
   - 登录已有账户
   - 查看用户信息
   - 退出登录

---

## 📱 真机调试

### 步骤

1. **确保手机和电脑在同一 Wi-Fi**
2. **修改 API 地址为电脑 IP**
   ```typescript
   const API_BASE_URL = 'http://192.168.1.100:3000/api'
   ```
3. **点击"预览"按钮**
4. **扫描二维码**

### 常见问题

❌ **网络请求失败**
- 检查手机和电脑是否在同一网络
- 确认 API 地址是否正确
- 关闭防火墙或开放 3000 端口

❌ **白屏**
- 查看 Console 是否有错误
- 确认后端服务是否正常运行
- 检查 API_BASE_URL 配置

---

## 🎨 开发建议

### 目录说明

```
src/
├── pages/           # 页面（添加新页面需在 app.config.ts 注册）
├── components/      # 组件
├── services/        # API 服务（已封装认证逻辑）
└── utils/           # 工具函数
```

### 添加新页面

1. 创建页面目录:
   ```bash
   mkdir -p src/pages/new-page
   ```

2. 创建页面文件:
   ```typescript
   // src/pages/new-page/index.tsx
   import { View, Text } from '@tarojs/components'
   
   export default function NewPage() {
     return (
       <View>
         <Text>New Page</Text>
       </View>
     )
   }
   ```

3. 注册页面:
   ```typescript
   // src/app.config.ts
   export default defineAppConfig({
     pages: [
       'pages/index/index',
       'pages/profile/index',
       'pages/new-page/index'  // 添加这行
     ]
   })
   ```

### 使用 API 服务

```typescript
import { apiService } from '@/services/api'

// 登录
const response = await apiService.login(email, password)

// 获取当前用户
const userResponse = await apiService.getCurrentUser()

// 检查登录状态
const isLoggedIn = await apiService.isAuthenticated()
```

---

## 📚 更多资源

- [完整开发指南](./README.md)
- [Taro 官方文档](https://taro-docs.jd.com/)
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [项目架构说明](../../ARCHITECTURE.md)

---

🎉 **恭喜！你的小程序已经启动成功了！**





