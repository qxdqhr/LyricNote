# 🚀 LyricNote Backend 快速启动指南

## 📋 系统访问信息

### 🔑 管理后台登录

| 项目 | 信息 |
|------|------|
| **访问地址** | http://localhost:3000/admin |
| **管理员邮箱** | admin@lyricnote.com |
| **管理员密码** | admin123456 |
| **角色权限** | SUPER_ADMIN（全部权限） |

### 🌐 其他访问地址

| 服务 | 地址 | 描述 |
|------|------|------|
| **系统首页** | http://localhost:3000 | 项目概览和状态 |
| **API 健康检查** | http://localhost:3000/api/health | 系统健康状态 |
| **数据库管理** | http://localhost:5555 | Prisma Studio |

## 🛠 开发环境启动

### 1. 安装依赖
```bash
cd lyricnote-backend
npm install
```

### 2. 环境配置
```bash
cp env.example .env
# 编辑 .env 文件配置数据库等信息
```

### 3. 数据库初始化
```bash
npm run db:generate    # 生成 Prisma 客户端
npm run db:push       # 推送数据库模式
npm run db:seed       # 创建管理员账户
```

### 4. 启动开发服务器
```bash
npm run dev
```

### 5. 访问管理后台
1. 打开浏览器访问: http://localhost:3000/admin
2. 使用上述管理员账户登录
3. 开始管理系统！

## 📱 与移动端集成

### API 基础地址
```
http://localhost:3000/api
```

### 主要 API 端点
- `POST /api/recognition` - 音频识别
- `GET /api/lyrics` - 获取歌词
- `POST /api/lyrics/convert` - 歌词转换
- `POST /api/auth/login` - 用户登录
- `POST /api/users` - 用户注册

### React Native 调用示例
```javascript
// 在移动端应用中调用 API
const API_BASE = 'http://localhost:3000/api'

// 音频识别
const recognizeAudio = async (audioFile, token) => {
  const formData = new FormData()
  formData.append('audio', audioFile)
  
  const response = await fetch(`${API_BASE}/recognition`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  
  return response.json()
}
```

## ⚠️ 重要提醒

### 安全注意事项
- **🔒 生产环境请务必修改默认管理员密码**
- **🔑 配置强密码策略和双因素认证**
- **🛡️ 定期更新 JWT_SECRET 等安全密钥**

### 开发提醒
- 管理员账户由 `npm run db:seed` 自动创建
- 如需重置数据库，重新运行种子脚本
- 所有敏感配置请使用环境变量

## 🔧 常用命令

| 命令 | 功能 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run db:studio` | 打开数据库管理界面 |
| `npm run db:seed` | 重新创建管理员账户 |

## 📞 问题解决

### 常见问题
1. **端口被占用**: 修改 `.env` 中的 `PORT` 配置
2. **数据库连接失败**: 检查 `DATABASE_URL` 配置
3. **管理员登录失败**: 运行 `npm run db:seed` 重新创建账户

### 获取帮助
- 查看完整文档: `README.md`
- 检查项目状态: http://localhost:3000/api/health
- 查看数据库: `npm run db:studio`

---

🎌 **LyricNote Backend** - 准备就绪，开始您的日语音乐识别之旅！
