# 🚀 LyricNote GitHub Actions 部署指南

## 📋 概述

已为您的LyricNote项目配置了完整的GitHub Actions CI/CD流水线，包括：
- ✅ **自动化测试** - 代码质量、单元测试、安全扫描
- ✅ **移动端构建** - Android/iOS应用自动构建
- ✅ **Docker部署** - 生产环境自动部署
- ✅ **多环境支持** - 生产和测试环境分离

## 🎯 功能特性

### 🧪 **自动化测试** (`test.yml`)
- **触发条件**: 推送代码或创建PR时自动运行
- **测试内容**: 
  - 🔍 ESLint代码检查
  - 📝 TypeScript编译验证
  - 🧪 单元测试执行
  - 🔒 安全漏洞扫描
  - 🏗 构建验证测试
  - 🐳 Docker镜像测试

### 📱 **移动端构建** (`mobile-build.yml`)
- **触发条件**: 移动端代码变更或手动触发
- **支持平台**: Android APK/AAB, iOS应用包
- **构建配置**: 开发版、预览版、生产版
- **自动分发**: 支持TestFlight和Google Play提交

### 🚀 **生产部署** (`deploy.yml`)
- **触发条件**: 推送到main分支或创建版本标签
- **部署流程**: 测试→构建→部署→验证
- **服务管理**: Docker Compose自动化部署
- **健康检查**: 自动验证部署状态

### 🚧 **测试环境** (`deploy-staging.yml`)
- **触发条件**: 推送到develop分支
- **环境隔离**: 独立的测试环境配置
- **冒烟测试**: 基础功能自动验证

## ⚡ 5分钟快速配置

### 1. 运行自动化设置脚本
```bash
cd /Users/qihongrui/Desktop/LyricNote
./scripts/setup-github-actions.sh
```

### 2. 必需的GitHub Secrets配置

访问您的GitHub仓库：
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

#### 🔐 生产环境密钥
| Secret名称 | 示例值 | 说明 |
|------------|--------|------|
| `DEPLOY_HOST` | `123.456.789.10` | 生产服务器IP |
| `DEPLOY_USER` | `deploy` | 服务器用户名 |
| `DEPLOY_SSH_KEY` | `-----BEGIN PRIVATE KEY-----...` | SSH私钥 |
| `POSTGRES_PASSWORD` | `secure_pg_pass_123` | PostgreSQL密码 |
| `REDIS_PASSWORD` | `secure_redis_pass_123` | Redis密码 |
| `JWT_SECRET` | `your_32_char_jwt_secret_key_here` | JWT密钥 |
| `NEXTAUTH_SECRET` | `your_32_char_nextauth_secret_here` | NextAuth密钥 |
| `DEEPSEEK_API_KEY` | `sk-xxxxxxxxxxxxx` | DeepSeek API密钥 |
| `DOMAIN` | `lyricnote.com` | 生产域名 |
| `EXPO_TOKEN` | `expo_token_here` | Expo认证令牌 |

#### ☁️ 阿里云OSS配置
| Secret名称 | 说明 |
|------------|------|
| `ALIYUN_OSS_ACCESS_KEY_ID` | 阿里云AccessKey ID |
| `ALIYUN_OSS_ACCESS_KEY_SECRET` | 阿里云AccessKey Secret |
| `ALIYUN_OSS_BUCKET` | OSS存储桶名称 |
| `ALIYUN_OSS_REGION` | OSS区域 (如: oss-cn-hangzhou) |

### 3. 推送代码触发CI/CD
```bash
# 添加所有GitHub Actions文件
git add .github/

# 提交GitHub Actions配置
git commit -m "🚀 Add comprehensive GitHub Actions CI/CD

✅ Features:
- Automated testing suite
- Mobile app building (Android/iOS)  
- Production deployment automation
- Staging environment support
- Security scanning & quality checks"

# 推送到GitHub (网络恢复后)
git push origin main
```

## 🔄 工作流触发说明

### 🧪 测试工作流
```bash
# 自动触发条件:
- 推送到 main/develop 分支
- 创建 Pull Request 到 main
- 每日定时运行 (UTC 02:00)

# 手动触发:
# GitHub仓库 → Actions → Test Suite → Run workflow
```

### 📱 移动端构建
```bash
# 自动触发条件:
- packages/mobile/ 代码变更
- packages/shared/ 代码变更

# 手动触发:
# GitHub仓库 → Actions → Mobile App Build → Run workflow
# 可选择: platform (android/ios/all), profile (dev/preview/production)
```

### 🚀 生产部署
```bash
# 自动触发条件:
- 推送到 main 分支 → 自动部署到生产环境
- 创建版本标签 (v1.0.0) → 构建+部署+发布

# 手动触发:
# GitHub仓库 → Actions → Deploy → Run workflow
```

### 🚧 测试环境部署
```bash
# 自动触发条件:
- 推送到 develop 分支 → 自动部署到测试环境

# 手动触发:
# GitHub仓库 → Actions → Deploy to Staging → Run workflow
```

## 📱 移动端应用获取

### 🤖 Android应用
1. **自动构建**: 推送代码后自动生成APK
2. **下载方式**: 
   - GitHub Actions → Mobile App Build → Artifacts
   - Expo Dashboard: https://expo.dev/accounts/[username]/projects/lyricnote/builds
3. **安装**: 直接安装APK文件 (需开启未知来源)

### 🍎 iOS应用
1. **TestFlight内测**: 
   - 自动提交到App Store Connect
   - 通过TestFlight应用安装
2. **Expo Go**: 开发版本可通过Expo Go扫码安装

### 📊 构建状态查看
访问: `https://github.com/qxdqhr/LyricNote/actions`
- 📊 实时构建进度
- 📁 构建产物下载
- 📜 详细日志查看

## 🛠 本地开发工作流

### 功能开发流程
```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat: add new feature"

# 3. 推送分支
git push origin feature/new-feature

# 4. 创建PR到main分支
# → 自动触发测试工作流

# 5. 测试通过后合并到main
# → 自动触发生产部署
```

### 移动端构建测试
```bash
# 本地测试移动端编译
cd packages/mobile
npx expo export --platform web

# 手动触发云端构建
# GitHub → Actions → Mobile App Build → Run workflow
```

### 生产环境验证
```bash
# 部署完成后访问:
https://your-domain.com/api/health    # API健康检查
https://your-domain.com/admin         # 管理后台
```

## 🚨 故障排除

### 常见问题和解决方案

#### 1. SSH连接失败
```bash
# 生成新的SSH密钥
ssh-keygen -t rsa -b 4096 -C "deploy@lyricnote.com"

# 添加公钥到服务器
cat ~/.ssh/id_rsa.pub | ssh user@server 'cat >> ~/.ssh/authorized_keys'

# 将私钥添加到GitHub Secrets (DEPLOY_SSH_KEY)
cat ~/.ssh/id_rsa
```

#### 2. Expo构建失败
```bash
# 检查Expo配置
cd packages/mobile
npx expo doctor

# 更新app.json配置
{
  "expo": {
    "owner": "your-expo-username",
    "projectId": "your-project-id"
  }
}

# 获取Expo认证令牌
# 访问: https://expo.dev/accounts/[username]/settings/access-tokens
```

#### 3. Docker部署失败
```bash
# 检查服务器Docker状态
ssh user@server "docker --version && docker-compose --version"

# 手动测试部署
ssh user@server "cd /opt/lyricnote && docker-compose up -d"
```

#### 4. 环境变量问题
- 确保所有必需的Secrets已配置
- 检查变量名拼写是否正确
- 验证特殊字符是否需要转义

### 调试技巧

#### 查看构建日志
1. 访问GitHub仓库的Actions页面
2. 点击失败的工作流
3. 展开失败的步骤查看详细日志
4. 下载完整日志文件分析

#### 本地验证
```bash
# 本地运行相同的命令
npm run ci:test    # 测试
npm run ci:build   # 构建
npm run ci:lint    # 代码检查

# Docker本地测试
docker build -f packages/backend/Dockerfile -t lyricnote-test .
docker run -p 3000:3000 lyricnote-test
```

## 📈 高级配置

### 自定义构建条件
编辑 `.github/workflows/*.yml` 文件：
```yaml
# 只在特定文件变更时触发
on:
  push:
    paths:
      - 'packages/backend/**'
      - 'packages/shared/**'

# 跳过CI (在commit message中)
git commit -m "docs: update README [skip ci]"
```

### 并行构建优化
```yaml
# 矩阵构建
strategy:
  matrix:
    node-version: [16, 18, 20]
    platform: [android, ios]
```

### 缓存优化
```yaml
# Node.js依赖缓存
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

# Docker层缓存
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

## 🔐 安全最佳实践

### Secrets管理
- 🔄 定期轮换密钥和令牌
- 🔒 使用最小权限原则
- 📋 定期审查Secrets使用情况

### 代码安全
- 🔍 每次构建运行安全扫描
- 📦 定期更新依赖项
- 🚫 避免在代码中硬编码敏感信息

### 部署安全
- 🔐 使用SSH密钥而非密码
- 🛡️ 配置服务器防火墙
- 🌐 强制使用HTTPS

## 📊 监控和分析

### 构建状态徽章
在README中添加状态徽章：
```markdown
![Tests](https://github.com/qxdqhr/LyricNote/workflows/Test%20Suite/badge.svg)
![Deploy](https://github.com/qxdqhr/LyricNote/workflows/Deploy/badge.svg)
![Mobile](https://github.com/qxdqhr/LyricNote/workflows/Mobile%20App%20Build/badge.svg)
```

### 性能监控
- 📊 构建时间趋势
- 📈 测试覆盖率报告
- 🚀 部署频率统计

## 🎉 成功案例

配置完成后，您将获得：

### ✅ **完全自动化的开发流程**
- 代码推送 → 自动测试 → 自动部署 → 自动通知

### 📱 **一键移动端分发**
- 代码提交 → 自动构建 → 生成安装包 → 分发测试

### 🚀 **零停机时间部署**
- 健康检查 → 滚动更新 → 回滚机制

### 📊 **全面的质量保证**
- 代码质量检查 → 安全扫描 → 性能测试

---

## 🎌 **LyricNote GitHub Actions已就绪！**

您现在拥有了企业级的CI/CD流水线：
- 🔄 **自动化测试和部署**
- 📱 **移动端应用构建**  
- 🐳 **Docker容器化部署**
- 🔒 **安全扫描和质量检查**

**下一步**: 推送代码到GitHub，观看自动化魔法的发生！✨
