# LyricNote Backend - 日语音乐识别应用后端系统

🎌 专注于日语歌曲识别和歌词处理的 Next.js 后端系统 + Web 管理平台

## 📋 项目概述

LyricNote Backend 是一个基于 Next.js 构建的现代化后端系统，为 LyricNote 移动应用提供 API 服务，并包含完整的 Web 管理后台。

### 🎯 核心功能

- **🎤 音乐识别 API** - 基于 AI 的日语歌曲识别
- **📝 歌词处理** - 汉字、平假名、罗马音多语言转换
- **👥 用户管理** - 用户注册、登录、权限控制
- **📚 收藏管理** - 歌曲收藏和分类管理
- **🤖 AI 集成** - DeepSeek 大模型日语优化处理
- **🔧 管理后台** - 完整的 Web 管理界面
- **📊 数据分析** - 用户行为和系统使用统计

### 🛠 技术栈

- **框架**: Next.js 15 (App Router)
- **数据库**: PostgreSQL + Prisma ORM
- **缓存**: Redis
- **认证**: JWT + 会话管理
- **AI 服务**: DeepSeek API
- **日语处理**: Kuroshiro.js
- **UI**: Tailwind CSS
- **部署**: Docker + Docker Compose

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- 可选: Docker & Docker Compose

### 1. 克隆项目

```bash
cd /Users/qihongrui/Desktop/LyricNote/lyricnote-backend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量文件并配置：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置以下关键信息：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/lyricnote"

# Redis 配置
REDIS_URL="redis://localhost:6379"

# JWT 密钥
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"

# DeepSeek AI 配置（可选）
DEEPSEEK_API_KEY="your-deepseek-api-key"

# 其他配置...
```

### 4. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 初始化种子数据（创建管理员账户）
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

## 📱 API 接口文档

### 认证相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户退出 |
| POST | `/api/users` | 用户注册 |

### 音乐识别

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/recognition` | 音频识别 |
| GET | `/api/recognition` | 识别历史 |

### 歌词处理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/lyrics` | 获取歌词 |
| POST | `/api/lyrics` | 创建/更新歌词 |
| POST | `/api/lyrics/convert` | 歌词格式转换 |
| PUT | `/api/lyrics/convert` | 批量转换 |

### 使用示例

#### 音频识别

```javascript
const formData = new FormData()
formData.append('audio', audioFile)
formData.append('userId', 'user_id')

const response = await fetch('/api/recognition', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})

const result = await response.json()
```

#### 歌词转换

```javascript
const response = await fetch('/api/lyrics/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    text: '夜に駆ける',
    to: 'all',
    useAI: true
  })
})

const converted = await response.json()
// 返回: { kanji, hiragana, romaji, translation }
```

## 🔧 管理后台

### 访问地址

开发环境: http://localhost:3000/admin

### 默认管理员账户

- **邮箱**: admin@lyricnote.com
- **密码**: admin123456
- **角色**: SUPER_ADMIN
- **权限**: 系统全部管理权限

> ⚠️ **重要提醒**: 生产环境请务必修改默认密码！

### 管理功能

- **📊 系统概览** - 用户、歌曲、识别统计
- **👥 用户管理** - 查看、编辑、管理用户
- **🎵 歌曲管理** - 歌曲库维护和分类
- **📝 歌词管理** - 歌词审核和质量控制
- **📈 数据分析** - 使用统计和趋势分析
- **🤖 AI 监控** - AI 服务使用和成本统计

## 🗄 数据库设计

### 核心表结构

- **users** - 用户信息和权限
- **songs** - 歌曲基本信息
- **lyrics** - 多语言歌词内容
- **recognitions** - 音乐识别记录
- **collections** - 用户收藏夹
- **sessions** - 用户会话管理
- **ai_process_logs** - AI 处理日志

### 数据库管理

```bash
# 查看数据库
npm run db:studio

# 创建迁移
npm run db:migrate

# 重置数据库（危险操作）
npx prisma migrate reset
```

## 🤖 AI 服务集成

### DeepSeek 配置

1. 获取 DeepSeek API 密钥
2. 配置环境变量 `DEEPSEEK_API_KEY`
3. 调整 AI 处理参数

### 日语处理

- **Kuroshiro.js** - 本地假名转换
- **MeCab** - 形态素解析（可选）
- **DeepSeek** - AI 增强处理

## 📊 监控和日志

### 系统监控

- API 响应时间统计
- 数据库连接状态
- Redis 缓存命中率
- AI 服务调用统计

### 日志管理

- 用户操作日志
- API 调用日志
- 错误和异常日志
- AI 处理性能日志

## 🔒 安全考虑

- JWT Token 认证
- 密码 bcrypt 加密
- API 限流保护
- 输入数据验证
- SQL 注入防护（Prisma）
- XSS 防护

## 🚀 部署指南

### Docker 部署

```bash
# 构建镜像
docker build -t lyricnote-backend .

# 运行容器
docker-compose up -d
```

### 生产环境

1. 设置环境变量
2. 配置数据库连接
3. 启用 HTTPS
4. 配置反向代理
5. 设置监控告警

## 🛠 开发指南

### 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── admin/             # 管理后台页面
│   └── globals.css        # 全局样式
├── lib/                   # 核心库
│   ├── database.ts        # Prisma 客户端
│   └── redis.ts           # Redis 缓存
├── services/              # 业务服务
│   ├── ai.ts              # AI 服务
│   └── japanese.ts        # 日语处理
├── middleware/            # 中间件
│   └── auth.ts            # 认证中间件
└── types/                 # TypeScript 类型
```

### 开发规范

- 使用 TypeScript 严格模式
- 遵循 Next.js 最佳实践
- API 统一返回格式
- 错误处理和日志记录
- 单元测试覆盖

### 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage
```

## 📈 性能优化

- Redis 缓存策略
- 数据库查询优化
- API 响应压缩
- 静态资源 CDN
- 数据库连接池

## 🔄 更新日志

### v1.0.0 (2024-09-22)

- ✅ 基础 API 架构完成
- ✅ 用户认证系统
- ✅ 音乐识别功能
- ✅ 歌词处理服务
- ✅ 管理后台界面
- ✅ AI 服务集成
- ✅ 数据库设计

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 📞 联系支持

- 项目地址: https://github.com/your-org/lyricnote-backend
- 问题反馈: Issues 页面
- 邮箱: support@lyricnote.com

---

🎌 **LyricNote** - 让日语音乐学习更简单！