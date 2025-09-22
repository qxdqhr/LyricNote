# 🚀 LyricNote GitHub Actions CI/CD

本目录包含了LyricNote项目的完整CI/CD配置，实现自动化测试、构建和部署。

## 📋 工作流概览

### 🧪 `test.yml` - 测试套件
**触发条件**: 推送到 main/develop 分支，或创建 PR
- **代码质量检查**: ESLint, TypeScript编译检查
- **单元测试**: 各包的单元测试
- **安全扫描**: npm audit 安全漏洞检查
- **构建测试**: 验证所有包能正常构建
- **Docker测试**: 验证Docker镜像构建
- **移动端编译**: 验证Expo应用编译

### 📱 `mobile-build.yml` - 移动端构建
**触发条件**: 移动端代码变更，或手动触发
- **Android构建**: 生成APK或AAB文件
- **iOS构建**: 生成iOS应用包
- **应用商店提交**: 自动提交到App Store/Google Play
- **构建报告**: 生成详细的构建报告

### 🚀 `deploy.yml` - 生产部署
**触发条件**: 推送到 main 分支或创建标签
- **Docker镜像构建**: 构建并推送Docker镜像
- **生产部署**: 部署到生产服务器
- **健康检查**: 验证部署是否成功
- **发布创建**: 自动创建GitHub Release

### 🚧 `deploy-staging.yml` - 测试环境部署
**触发条件**: 推送到 develop 分支
- **测试环境部署**: 部署到测试服务器
- **冒烟测试**: 基础功能验证
- **环境报告**: 生成测试环境状态报告

## 🔧 必需的Secrets配置

### 🌐 生产环境 (Production)
在 GitHub 仓库的 Settings → Secrets and variables → Actions 中配置：

```bash
# 🔐 服务器访问
DEPLOY_HOST=your-production-server-ip
DEPLOY_USER=deploy
DEPLOY_SSH_KEY=your-ssh-private-key

# 🗄️ 数据库配置
POSTGRES_PASSWORD=your-secure-postgres-password
REDIS_PASSWORD=your-secure-redis-password

# 🔑 应用密钥
JWT_SECRET=your-jwt-secret-minimum-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters

# 🤖 AI服务
DEEPSEEK_API_KEY=your-deepseek-api-key

# ☁️ 阿里云OSS
ALIYUN_OSS_ACCESS_KEY_ID=your-access-key-id
ALIYUN_OSS_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_OSS_BUCKET=your-bucket-name
ALIYUN_OSS_REGION=oss-cn-hangzhou

# 🌐 域名
DOMAIN=your-production-domain.com

# 📱 Expo配置
EXPO_TOKEN=your-expo-auth-token
EXPO_USERNAME=your-expo-username
```

### 🚧 测试环境 (Staging)
```bash
# 🔐 测试服务器
STAGING_HOST=your-staging-server-ip
STAGING_USER=deploy
STAGING_SSH_KEY=your-staging-ssh-private-key

# 🗄️ 测试数据库
STAGING_POSTGRES_PASSWORD=your-staging-postgres-password
STAGING_REDIS_PASSWORD=your-staging-redis-password

# 🔑 测试密钥
STAGING_JWT_SECRET=your-staging-jwt-secret
STAGING_NEXTAUTH_SECRET=your-staging-nextauth-secret

# 🌐 测试域名
STAGING_DOMAIN=staging.your-domain.com
```

## 🔄 工作流详细说明

### 1. 🧪 测试工作流 (test.yml)

#### 触发条件
- 推送到 `main` 或 `develop` 分支
- 创建针对 `main` 分支的 Pull Request
- 每日定时运行 (UTC 02:00)

#### 主要步骤
1. **代码质量检查**
   - ESLint 代码风格检查
   - TypeScript 编译验证
   - 格式化检查

2. **单元测试**
   - 并行运行各包的测试
   - 生成测试覆盖率报告
   - 上传测试结果

3. **安全扫描**
   - npm audit 漏洞检查
   - 依赖安全分析
   - 生成安全报告

4. **构建验证**
   - 验证各包能正常构建
   - Docker 镜像构建测试
   - 移动端编译测试

### 2. 📱 移动端构建 (mobile-build.yml)

#### 触发条件
- 移动端相关代码变更
- 手动触发 (支持选择平台和配置)

#### 构建配置
- **Development**: 包含调试功能的开发版本
- **Preview**: 内测版本，适合分发测试
- **Production**: 生产版本，可提交应用商店

#### 平台支持
- **Android**: 生成APK (Preview) 或 AAB (Production)
- **iOS**: 生成可安装的应用包
- **All**: 同时构建两个平台

### 3. 🚀 生产部署 (deploy.yml)

#### 触发条件
- 推送到 `main` 分支
- 创建版本标签 (v*)

#### 部署流程
1. **测试验证**: 运行完整测试套件
2. **Docker构建**: 构建并推送镜像到注册表
3. **移动端构建**: 构建移动应用
4. **服务器部署**: 
   - 上传代码到服务器
   - 启动Docker服务
   - 运行健康检查
5. **清理**: 清理旧镜像和备份
6. **发布**: 创建GitHub Release (仅限标签)

### 4. 🚧 测试环境部署 (deploy-staging.yml)

#### 触发条件
- 推送到 `develop` 分支
- 手动触发

#### 测试流程
1. **环境准备**: 配置测试环境变量
2. **代码部署**: 部署到测试服务器
3. **服务启动**: 使用不同端口启动服务
4. **冒烟测试**: 基础功能验证
5. **报告生成**: 生成环境状态报告

## 📊 构建状态监控

### GitHub Actions 页面
访问 `https://github.com/qxdqhr/LyricNote/actions` 查看：
- 🔄 实时构建状态
- 📊 历史构建记录
- 📋 详细日志信息
- 📁 构建产物下载

### 状态徽章
在README中添加状态徽章：
```markdown
![CI](https://github.com/qxdqhr/LyricNote/workflows/Test%20Suite/badge.svg)
![Deploy](https://github.com/qxdqhr/LyricNote/workflows/Deploy/badge.svg)
```

## 🔧 本地测试

### 测试工作流
```bash
# 运行本地测试
npm run test

# 代码质量检查
npm run lint

# 构建验证
npm run build
```

### Docker测试
```bash
# 本地Docker构建测试
docker build -f packages/backend/Dockerfile -t lyricnote-test .

# 本地环境运行
docker-compose up -d
```

### 移动端测试
```bash
# 移动端编译测试
cd packages/mobile
npx expo export --platform web
```

## 🚨 故障排除

### 常见问题

#### 1. SSH连接失败
```bash
# 确保SSH密钥格式正确
ssh-keygen -t rsa -b 4096 -C "deploy@lyricnote"

# 添加公钥到服务器
ssh-copy-id deploy@your-server
```

#### 2. Docker构建失败
```bash
# 检查Dockerfile路径
# 确保共享包已构建
npm run build:shared
```

#### 3. Expo构建失败
```bash
# 检查Expo配置
npx expo doctor

# 验证认证Token
expo whoami
```

#### 4. 环境变量问题
- 确保所有必需的Secrets已配置
- 检查变量名拼写
- 验证特殊字符是否正确转义

### 调试技巧

#### 1. 启用调试日志
在工作流中添加：
```yaml
- name: Enable debug logging
  run: echo "ACTIONS_STEP_DEBUG=true" >> $GITHUB_ENV
```

#### 2. SSH调试
```yaml
- name: Debug via SSH
  uses: lhotari/action-upterm@v1
  if: failure()
```

#### 3. 查看工作流日志
- 访问Actions页面查看详细日志
- 下载日志文件进行离线分析
- 检查各步骤的输出和错误信息

## 📈 性能优化

### 缓存策略
- **Node.js缓存**: 使用 `actions/setup-node` 的内置缓存
- **Docker层缓存**: 使用 `docker/build-push-action` 的缓存功能
- **依赖缓存**: 缓存 `node_modules` 减少安装时间

### 并行构建
- 使用 `strategy.matrix` 并行运行测试
- 独立的job并行执行
- 合理设置依赖关系

### 构建优化
- 使用多阶段Docker构建
- 优化Dockerfile层次结构
- 减少构建上下文大小

## 🔒 安全最佳实践

### Secrets管理
- 使用GitHub Secrets存储敏感信息
- 定期轮换密钥和Token
- 最小权限原则

### 代码安全
- 自动安全扫描
- 依赖漏洞检查
- 定期更新依赖

### 部署安全
- 使用SSH密钥认证
- 服务器防火墙配置
- HTTPS强制使用

---

🎌 **LyricNote CI/CD 已就绪！完整的自动化构建和部署流水线！**
