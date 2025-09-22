# 🚀 LyricNote 快速部署指南

## 📋 概述

本指南将帮助您在30分钟内完成LyricNote项目的完整部署，包括：
- ✅ 阿里云服务器Docker部署
- ✅ 生成iOS和Android测试包
- ✅ 完整的生产环境配置

## 🎯 部署目标

### 🌐 后端服务
- **API地址**: `https://your-domain.com/api`
- **管理后台**: `https://your-domain.com/admin`
- **健康检查**: `https://your-domain.com/api/health`

### 📱 移动端应用
- **Android APK**: 可直接安装的测试包
- **iOS TestFlight**: 内测版本
- **Expo Development**: 开发调试版本

## ⚡ 5分钟快速测试

在部署到服务器之前，先在本地验证项目：

```bash
# 1. 运行部署测试
./scripts/test-deployment.sh

# 2. 检查测试报告
cat test-report.md

# 3. 如果测试通过，继续服务器部署
```

## 🏗 服务器部署 (15分钟)

### 步骤1: 准备服务器环境

```bash
# 连接到您的阿里云服务器
ssh root@your-server-ip

# 安装Docker (如果未安装)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# 安装Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 步骤2: 部署项目

```bash
# 克隆项目
cd /opt
git clone https://github.com/your-username/lyricnote.git
cd lyricnote

# 配置环境变量
cp env.production.example .env
nano .env  # 编辑配置

# 一键部署
./scripts/deploy.sh
```

### 步骤3: 配置域名和SSL

```bash
# 配置域名DNS指向服务器IP
# 获取免费SSL证书
certbot certonly --standalone -d your-domain.com

# 复制证书
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem

# 重启服务
docker-compose restart nginx
```

## 📱 移动端构建 (10分钟)

### 步骤1: 准备Expo环境

```bash
# 安装Expo工具
npm install -g @expo/cli eas-cli

# 注册Expo账户
# 访问 https://expo.dev 注册

# 登录
eas login
```

### 步骤2: 配置项目

```bash
# 编辑移动端配置
nano packages/mobile/app.json

# 更新以下字段:
# "owner": "your-expo-username"
# "projectId": "your-expo-project-id"  
# "apiUrl": "https://your-domain.com/api"
```

### 步骤3: 构建测试包

```bash
# 使用自动化脚本
./scripts/build-mobile.sh preview

# 或手动构建
cd packages/mobile
eas build --platform android --profile preview  # Android APK
eas build --platform ios --profile preview      # iOS TestFlight
```

## 📊 验证部署

### 后端验证

```bash
# 健康检查
curl https://your-domain.com/api/health

# 管理后台访问
# 浏览器访问: https://your-domain.com/admin
# 默认账户: admin@lyricnote.com / admin123456
```

### 移动端验证

```bash
# 查看构建状态
eas build:list --limit=5

# 下载测试包
# Android: 直接下载APK文件
# iOS: 通过TestFlight或Expo Go安装
```

## 🔧 环境配置清单

### 必需配置

```bash
# .env 文件配置
POSTGRES_PASSWORD=强密码(至少16位)
REDIS_PASSWORD=强密码(至少16位)
JWT_SECRET=随机字符串(至少32位)
NEXTAUTH_SECRET=随机字符串(至少32位)
DEEPSEEK_API_KEY=您的DeepSeek API密钥
DOMAIN=your-domain.com
```

### 阿里云OSS配置

```bash
ALIYUN_OSS_ACCESS_KEY_ID=您的AccessKey ID
ALIYUN_OSS_ACCESS_KEY_SECRET=您的AccessKey Secret
ALIYUN_OSS_BUCKET=存储桶名称
ALIYUN_OSS_REGION=区域(如:oss-cn-hangzhou)
```

### Expo项目配置

```json
{
  "expo": {
    "owner": "your-expo-username",
    "projectId": "your-expo-project-id",
    "extra": {
      "apiUrl": "https://your-domain.com/api"
    }
  }
}
```

## 🎯 获取测试包的3种方式

### 方式1: 内部测试APK (推荐)

```bash
# 构建预览版本
eas build --platform android --profile preview

# 优点: 可直接安装，无需应用商店
# 用途: 内部测试、客户演示
# 下载: https://expo.dev/accounts/[username]/projects/[project]/builds
```

### 方式2: TestFlight内测

```bash
# 构建iOS版本
eas build --platform ios --profile preview

# 提交到TestFlight
eas submit --platform ios

# 优点: 接近App Store体验
# 用途: iOS用户内测
# 安装: 通过TestFlight应用安装
```

### 方式3: Expo Development Build

```bash
# 构建开发版本
eas build --platform all --profile development

# 优点: 包含调试功能，支持热更新
# 用途: 开发调试
# 安装: 通过Expo Go或开发客户端
```

## 🚨 常见问题解决

### 问题1: Docker构建失败

```bash
# 清理Docker缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

### 问题2: 移动端构建失败

```bash
# 清理Expo缓存
cd packages/mobile
rm -rf node_modules .expo
npm install

# 检查配置
expo doctor
```

### 问题3: SSL证书问题

```bash
# 检查证书有效性
openssl x509 -in nginx/ssl/cert.pem -text -noout

# 重新获取证书
certbot renew --force-renewal
```

### 问题4: 数据库连接失败

```bash
# 检查数据库状态
docker-compose logs postgres

# 重置数据库
docker-compose down -v
docker-compose up -d postgres
```

## 📱 分发测试包

### Android分发
1. **直接分发**: 将APK文件发送给测试用户
2. **Google Play内测**: 上传到Google Play Console内测轨道
3. **第三方平台**: 使用蒲公英、TestFlight等平台

### iOS分发
1. **TestFlight**: 提交到App Store Connect进行内测
2. **Ad Hoc**: 使用设备UDID进行定向分发
3. **Expo Go**: 使用Expo Go应用扫码安装

## 📊 监控和维护

### 服务器监控

```bash
# 查看服务状态
docker-compose ps

# 查看资源使用
docker stats

# 查看日志
docker-compose logs -f backend
```

### 应用更新

```bash
# 代码更新
git pull
npm run build:shared
docker-compose build
docker-compose up -d

# 移动端更新
cd packages/mobile
eas update --branch preview
```

## 🎉 完成！

恭喜您已经完成了LyricNote项目的完整部署！

### 🔗 访问链接
- **API服务**: https://your-domain.com/api/health
- **管理后台**: https://your-domain.com/admin
- **移动端构建**: https://expo.dev/accounts/[username]/projects/[project]

### 📞 技术支持
- **文档**: [完整部署指南](docs/deployment.md)
- **问题反馈**: GitHub Issues
- **更新日志**: [CHANGELOG.md](CHANGELOG.md)

---

🎌 **LyricNote已就绪！** 开始您的日语音乐识别之旅吧！
