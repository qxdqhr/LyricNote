# 环境变量配置指南 | Environment Variables Setup

## 📋 概述

本文档说明了项目所需的所有环境变量配置。在开始开发之前，请根据此文档创建相应的
`.env.local` 文件。

## 🚀 快速开始

### Backend 环境配置

在 `packages/backend/` 目录下创建 `.env.local` 文件：

```bash
# 开发环境
cp packages/backend/.env.example packages/backend/.env.local

# 生产环境
cp packages/backend/.env.example packages/backend/.env.production
```

## 📝 环境变量说明

### 1. 数据库配置 (必需)

```env
# PostgreSQL 数据库连接字符串
DATABASE_URL=postgresql://用户名:密码@主机:端口/数据库名

# 示例 - 本地开发
DATABASE_URL=postgresql://postgres:password@localhost:5432/lyricnote_dev

# 示例 - 生产环境
DATABASE_URL=postgresql://user:pass@your-db-host.com:5432/lyricnote_prod
```

### 2. Redis 配置 (可选)

```env
# Redis 连接字符串
REDIS_URL=redis://localhost:6379

# 如果需要密码
REDIS_URL=redis://:password@localhost:6379
REDIS_PASSWORD=your-redis-password
```

### 3. 认证配置 (必需)

```env
# JWT 密钥 - 用于签名和验证令牌
# 生成方法: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session 密钥 - 用于会话加密
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Better Auth 密钥
BETTER_AUTH_SECRET=your-better-auth-secret-key

# Token 过期时间（秒）
JWT_EXPIRES_IN=86400           # 24小时
REFRESH_TOKEN_EXPIRES_IN=604800 # 7天
```

**🔐 安全提示：**

- 生产环境必须使用强密钥
- 定期更换密钥
- 不要将密钥提交到版本控制系统

### 4. API 配置

```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:3000    # 开发环境
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # 生产环境

API_BASE_URL=http://localhost:3000

# API 速率限制
RATE_LIMIT_MAX=100              # 每个窗口期最大请求数
RATE_LIMIT_WINDOW_MS=900000     # 窗口期时长（15分钟）
```

### 5. 应用配置

```env
# 应用环境
NODE_ENV=development  # development | production | test

# 应用端口
PORT=3000

# 应用域名
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. AI 服务配置 (可选)

```env
# OpenAI 配置
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
OPENAI_API_BASE_URL=https://api.openai.com/v1

# 或使用国内代理
# OPENAI_API_BASE_URL=https://your-proxy-url.com/v1
```

### 7. 对象存储配置 (可选)

#### 阿里云 OSS

```env
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_OSS_REGION=oss-cn-beijing
ALIYUN_OSS_BUCKET=your-bucket-name
```

#### AWS S3

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
```

### 8. 邮件服务配置 (可选)

```env
# SMTP 配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**Gmail 配置说明：**

1. 启用两步验证
2. 生成应用专用密码
3. 使用应用密码作为 SMTP_PASSWORD

### 9. 错误追踪 (推荐用于生产环境)

```env
# Sentry 配置
SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxx@sentry.io/xxxxxx
```

### 10. 社交登录 (可选)

#### 微信开放平台

```env
WECHAT_OPEN_APP_ID=wx1234567890abcdef
WECHAT_OPEN_APP_SECRET=your-app-secret
```

#### GitHub OAuth

```env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

#### Google OAuth

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 11. 微信小程序配置

```env
# 小程序 AppID 和 Secret
MINIAPP_APP_ID=wx1234567890abcdef
MINIAPP_APP_SECRET=your-miniapp-secret
```

### 12. 分析统计 (可选)

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 百度统计
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=your-baidu-id
```

### 13. CORS 配置

```env
# 允许的跨域源（多个用逗号分隔）
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:8081
```

### 14. 文件上传配置

```env
# 最大文件大小（字节，默认 10MB）
MAX_FILE_SIZE=10485760

# 允许的文件类型（逗号分隔）
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### 15. 日志配置

```env
# 日志级别
LOG_LEVEL=info  # debug | info | warn | error

# 是否启用调试模式
DEBUG=false

# 是否启用 Mock 数据
ENABLE_MOCK=false
```

## 🔒 安全最佳实践

1. **永远不要提交 `.env` 文件到版本控制**
   - `.env.local`
   - `.env.production`
   - `.env.development`

2. **使用强密钥**

   ```bash
   # 生成随机密钥
   openssl rand -base64 32

   # 或使用 Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **不同环境使用不同的密钥**
   - 开发环境：`.env.local`
   - 生产环境：`.env.production`
   - 测试环境：`.env.test`

4. **定期轮换敏感凭证**
   - API 密钥
   - JWT 密钥
   - 数据库密码

5. **使用环境变量管理服务**（生产环境推荐）
   - Vercel Environment Variables
   - AWS Systems Manager Parameter Store
   - HashiCorp Vault
   - Doppler

## 📦 不同环境的配置

### 开发环境 (.env.local)

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/lyricnote_dev
NEXT_PUBLIC_API_URL=http://localhost:3000
LOG_LEVEL=debug
DEBUG=true
```

### 生产环境 (.env.production)

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db-host:5432/lyricnote
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
LOG_LEVEL=warn
DEBUG=false
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 测试环境 (.env.test)

```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:password@localhost:5432/lyricnote_test
NEXT_PUBLIC_API_URL=http://localhost:3000
LOG_LEVEL=error
ENABLE_MOCK=true
```

## 🔍 验证配置

创建以下脚本验证环境变量：

```typescript
// packages/backend/scripts/verify-env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

try {
  envSchema.parse(process.env);
  console.log('✅ 环境变量验证通过');
} catch (error) {
  console.error('❌ 环境变量验证失败:', error);
  process.exit(1);
}
```

运行验证：

```bash
cd packages/backend
npx tsx scripts/verify-env.ts
```

## 📚 相关资源

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Drizzle ORM Configuration](https://orm.drizzle.team/docs/overview)
- [Better Auth Documentation](https://better-auth.com/docs)

## 🆘 常见问题

### Q: 为什么我的 API 请求失败？

A: 检查 `NEXT_PUBLIC_API_URL`
是否正确配置，确保包含正确的协议（http/https）和端口。

### Q: 数据库连接失败？

A: 验证 `DATABASE_URL` 格式是否正确，数据库服务是否运行，网络是否可达。

### Q: JWT 认证失败？

A: 确保 `JWT_SECRET` 在所有环境中保持一致，且长度足够（建议 32 字符以上）。

### Q: 如何在 Docker 中使用环境变量？

A: 使用 `--env-file` 参数：

```bash
docker run --env-file .env.production your-image
```

---

如有问题，请查看项目文档或提交 Issue。
