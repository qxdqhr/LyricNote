# 🎌 LyricNote 微信小程序

基于 Taro 3 开发的 LyricNote 微信小程序端。

## 📋 功能特性

- ✅ 用户登录/注册
- ✅ 与后台系统共享认证逻辑
- ✅ 响应式设计
- ✅ 统一的 API 服务封装

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 微信小程序
pnpm dev

# 或指定平台
pnpm dev:weapp   # 微信小程序
pnpm dev:alipay  # 支付宝小程序
pnpm dev:swan    # 百度小程序
pnpm dev:tt      # 字节跳动小程序
pnpm dev:qq      # QQ 小程序
pnpm dev:h5      # H5
```

### 构建

```bash
# 微信小程序
pnpm build

# 或指定平台
pnpm build:weapp
```

## 📱 开发工具

### 微信开发者工具

1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，选择"导入项目"
3. 项目目录选择：`packages/miniapp/dist`
4. AppID：使用测试号或自己的 AppID

## 🔧 配置

### API 地址配置

创建 `.env` 文件：

```bash
# 开发环境
TARO_APP_API_URL=http://localhost:3000/api

# 真机测试（替换为你的电脑 IP）
TARO_APP_API_URL=http://192.168.1.100:3000/api

# 生产环境
TARO_APP_API_URL=https://api.lyricnote.com/api
```

### 小程序配置

编辑 `project.config.json`：

```json
{
  "appid": "你的小程序AppID",
  "projectname": "lyricnote-miniapp"
}
```

## 📂 目录结构

```
packages/miniapp/
├── config/              # Taro 配置
│   ├── index.ts        # 基础配置
│   ├── dev.ts          # 开发环境配置
│   └── prod.ts         # 生产环境配置
├── src/
│   ├── pages/          # 页面
│   │   ├── index/      # 首页
│   │   └── profile/    # 我的页面
│   ├── services/       # API 服务
│   │   └── api.ts      # API 封装
│   ├── components/     # 组件
│   ├── utils/          # 工具函数
│   ├── types/          # 类型定义
│   ├── app.tsx         # 应用入口
│   ├── app.config.ts   # 应用配置
│   └── app.scss        # 全局样式
├── project.config.json # 小程序项目配置
├── package.json
└── tsconfig.json
```

## 🔐 认证功能

### 登录

使用与后台系统相同的认证接口：

```typescript
import { apiService } from '@/services/api'

// 登录
const response = await apiService.login(email, password)

// 注册
const response = await apiService.register(email, password, username)

// 获取当前用户
const response = await apiService.getCurrentUser()

// 登出
await apiService.logout()
```

### 存储

- Token 存储：`wx.storage` (auth_token)
- 用户信息存储：`wx.storage` (user_data)

## 🎨 样式

使用 Sass 编写样式，支持：
- rpx 单位自动转换
- 全局样式变量
- 模块化样式

## 📝 开发注意事项

1. **尺寸单位**：使用 `rpx` 作为响应式单位
2. **API 调用**：统一使用 `apiService` 封装
3. **路由跳转**：使用 Taro.navigateTo 等 API
4. **组件库**：优先使用 Taro 内置组件

## 🐛 常见问题

### Q: 网络请求失败？

A: 检查以下几点：
1. 确保后端服务已启动
2. 检查 API 地址配置是否正确
3. 小程序开发工具中开启"不校验合法域名"

### Q: 样式不生效？

A: 确保：
1. 使用 `rpx` 单位
2. 样式文件已正确引入
3. 类名拼写正确

### Q: 如何调试？

A: 
1. 使用微信开发者工具的调试面板
2. 使用 `console.log` 输出日志
3. 使用 Taro.showToast 显示提示

## 📚 相关文档

- [Taro 官方文档](https://taro-docs.jd.com/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [项目总览](../../README.md)
- [后端 API 文档](../backend/README.md)

---

🎌 **LyricNote 微信小程序** - 随时随地识别日语音乐！






