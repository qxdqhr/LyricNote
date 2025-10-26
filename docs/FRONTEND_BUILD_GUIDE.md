# 前端构建与发布指南

本指南说明如何使用 GitHub Actions 自动构建所有前端平台的安装包。

## 📦 支持的平台

| 平台                | 运行器    | 产物        | 大小   | 说明             |
| ------------------- | --------- | ----------- | ------ | ---------------- |
| **微信小程序**      | Ubuntu    | `.zip`      | ~2MB   | 小程序代码包     |
| **Desktop macOS**   | macOS     | `.dmg`      | ~100MB | macOS 安装包     |
| **Desktop Windows** | Windows   | `.exe`      | ~80MB  | Windows 安装程序 |
| **Mobile iOS**      | EAS Cloud | `.ipa`      | ~50MB  | iOS 应用包       |
| **Mobile Android**  | EAS Cloud | `.apk/.aab` | ~30MB  | Android 应用包   |

---

## 🚀 快速开始

### 1. 触发构建

#### 方式一: 推送代码到 main/develop 分支

```bash
git push origin main
```

#### 方式二: 手动触发 (推荐)

1. 访问 GitHub Actions 页面
2. 选择 "Build Frontend Packages" workflow
3. 点击 "Run workflow"
4. 选择要构建的平台:
   - `all` - 构建所有平台 (默认)
   - `desktop` - 仅构建桌面端
   - `mobile` - 仅构建移动端
   - `miniapp` - 仅构建小程序

#### 方式三: 发布新版本

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. 下载构建产物

1. 访问 [GitHub Actions](https://github.com/qxdqhr/LyricNote/actions)
2. 找到对应的 workflow 运行记录
3. 滚动到底部的 **Artifacts** 区域
4. 点击下载对应平台的安装包

---

## 🔧 平台详细配置

### 1️⃣ 微信小程序

#### 构建流程

```yaml
1. 安装依赖 2. 构建 Shared 包 3. 构建小程序代码 4. 打包为 .zip 5. 上传到 GitHub
Artifacts
```

#### 产物说明

- **文件名**: `miniapp-wechat-{commit-sha}.zip`
- **内容**: 小程序完整代码包
- **使用方式**:
  1. 下载并解压 zip 文件
  2. 用微信开发者工具打开 `dist` 目录
  3. 预览或上传到微信公众平台

#### 手动构建

```bash
cd packages/miniapp
pnpm build
cd dist
zip -r ../miniapp.zip .
```

---

### 2️⃣ Desktop 桌面端

#### macOS 构建

**系统要求**:

- macOS 运行器
- Electron Builder
- 代码签名证书 (可选)

**产物**:

- `@lyricnotedesktop-{version}-arm64.dmg` - Apple Silicon
- `@lyricnotedesktop-{version}-x64.dmg` - Intel Mac

**安装方式**:

1. 下载 .dmg 文件
2. 双击打开
3. 拖拽到 Applications 文件夹

**代码签名** (可选):

```yaml
# 在 GitHub Secrets 中配置:
APPLE_ID: 你的 Apple ID
APPLE_ID_PASSWORD: 应用专用密码
APPLE_TEAM_ID: 开发团队 ID
```

#### Windows 构建

**系统要求**:

- Windows 运行器
- Electron Builder
- 代码签名证书 (可选)

**产物**:

- `@lyricnote Setup {version}.exe` - 安装程序

**安装方式**:

1. 下载 .exe 文件
2. 双击运行安装向导
3. 按提示完成安装

**代码签名** (可选):

```yaml
# 在 GitHub Secrets 中配置:
WIN_CSC_LINK: Base64 编码的证书
WIN_CSC_KEY_PASSWORD: 证书密码
```

#### 手动构建

**macOS**:

```bash
cd packages/desktop
pnpm build
# 产物在 release/ 目录
```

**Windows**:

```powershell
cd packages/desktop
pnpm build
# 产物在 release\ 目录
```

---

### 3️⃣ Mobile 移动端

#### iOS 构建

**前置要求**:

- Expo 账号
- EAS Build 访问权限
- Apple Developer 账号 (用于发布)

**配置步骤**:

1. **创建 Expo 账号**

   ```bash
   npx expo login
   ```

2. **获取 Access Token**
   - 访问 https://expo.dev/accounts/[username]/settings/access-tokens
   - 创建新 token
   - 复制 token 值

3. **配置 GitHub Secret**

   ```yaml
   Settings → Secrets → Actions → New repository secret
   Name: EXPO_TOKEN
   Value: 你的 Expo access token
   ```

4. **配置 EAS Build**
   ```bash
   cd packages/mobile
   eas build:configure
   ```

**产物**:

- `.ipa` 文件 (iOS App Store 或 Ad Hoc 分发)
- 可在 [Expo Dashboard](https://expo.dev) 查看和下载

**手动构建**:

```bash
cd packages/mobile
eas build --platform ios --profile production
```

#### Android 构建

**配置步骤**:

1. **配置签名证书** (可选,用于发布)

   ```bash
   cd packages/mobile
   eas credentials
   ```

2. **手动构建**
   ```bash
   eas build --platform android --profile production
   ```

**产物**:

- `.apk` - 直接安装包
- `.aab` - Google Play 上架格式

**安装方式**:

- APK: 直接在 Android 设备上安装
- AAB: 上传到 Google Play Console

---

## ⚙️ 高级配置

### 自定义构建配置

#### Desktop 配置

编辑 `packages/desktop/package.json`:

```json
{
  "build": {
    "appId": "com.lyricnote.desktop",
    "productName": "LyricNote",
    "mac": {
      "target": "dmg",
      "category": "public.app-category.music",
      "icon": "build/icon.icns"
    },
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    }
  }
}
```

#### Mobile 配置

编辑 `packages/mobile/eas.json`:

```json
{
  "build": {
    "production": {
      "distribution": "store",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 环境变量配置

在 GitHub Actions 中配置环境变量:

```yaml
# .github/workflows/build-frontend.yml
env:
  EXPO_PUBLIC_API_URL: https://api.lyricnote.com
  VITE_API_URL: https://api.lyricnote.com
```

---

## 📊 构建状态监控

### 查看构建日志

1. 访问 GitHub Actions 页面
2. 选择对应的 workflow 运行
3. 点击具体的 job 查看详细日志

### 构建失败排查

#### 常见问题

**1. pnpm install 失败**

```bash
# 解决方案:
rm -rf node_modules pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

**2. Desktop 构建失败 (缺少证书)**

```yaml
# 在 workflow 中跳过代码签名:
env:
  CSC_IDENTITY_AUTO_DISCOVERY: false
```

**3. Mobile 构建失败 (EXPO_TOKEN 未配置)**

```yaml
# workflow 会自动跳过,手动构建:
cd packages/mobile eas build --platform ios --local
```

**4. 小程序包体积过大**

```bash
# 开启压缩和 Tree Shaking
# 在 config/index.ts 中配置:
{
  mini: {
    webpackChain(chain) {
      chain.optimization.minimize(true)
    }
  }
}
```

---

## 📝 发布流程

### 版本管理

1. **更新版本号**

   ```bash
   # 所有包统一版本
   npm version patch  # 1.0.0 → 1.0.1
   npm version minor  # 1.0.0 → 1.1.0
   npm version major  # 1.0.0 → 2.0.0
   ```

2. **创建 Git Tag**

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

3. **触发构建**
   - Tag 推送会自动触发 workflow
   - 等待所有平台构建完成

4. **下载并测试**
   - 从 Artifacts 下载所有安装包
   - 在各平台测试安装和运行

### 发布到应用商店

#### macOS App Store

1. 在 App Store Connect 创建应用
2. 配置代码签名
3. 使用 Xcode 或 Transporter 上传
4. 提交审核

#### Windows Microsoft Store

1. 在 Partner Center 创建应用
2. 配置应用信息
3. 上传 APPX 包
4. 提交认证

#### iOS App Store

1. EAS Build 完成后获取 .ipa
2. 使用 Transporter 上传到 App Store Connect
3. 配置应用信息和截图
4. 提交审核

#### Android Google Play

1. 在 Google Play Console 创建应用
2. 上传 AAB 文件
3. 配置应用详情
4. 提交审核

#### 微信小程序

1. 下载构建的 zip 包
2. 用微信开发者工具打开
3. 点击"上传"
4. 在微信公众平台提交审核

---

## 🔐 GitHub Secrets 配置清单

| Secret 名称            | 用途               | 必需                |
| ---------------------- | ------------------ | ------------------- |
| `EXPO_TOKEN`           | Expo EAS Build     | iOS/Android 构建    |
| `APPLE_ID`             | Apple 代码签名     | macOS 签名 (可选)   |
| `APPLE_ID_PASSWORD`    | Apple 应用专用密码 | macOS 签名 (可选)   |
| `APPLE_TEAM_ID`        | Apple 团队 ID      | macOS 签名 (可选)   |
| `WIN_CSC_LINK`         | Windows 证书       | Windows 签名 (可选) |
| `WIN_CSC_KEY_PASSWORD` | Windows 证书密码   | Windows 签名 (可选) |

---

## 📈 性能优化

### 构建时间优化

1. **使用缓存**
   - pnpm store 已缓存
   - Docker layers 已缓存

2. **并行构建**
   - 所有平台并行构建
   - 利用 GitHub Actions 并发

3. **选择性构建**
   ```bash
   # 仅构建特定平台
   gh workflow run build-frontend.yml -f platforms=desktop
   ```

### Artifacts 保留策略

- **默认**: 保留 30 天
- **Tag 构建**: 保留 90 天
- **PR 构建**: 保留 7 天

---

## 🆘 获取帮助

### 文档资源

- [Electron Builder](https://www.electron.build/)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Taro 文档](https://docs.taro.zone/)
- [GitHub Actions](https://docs.github.com/actions)

### 问题反馈

- GitHub Issues: https://github.com/qxdqhr/LyricNote/issues
- 构建失败: 查看 Actions 日志并附上相关信息

---

## ✅ 检查清单

发布前检查:

- [ ] 所有平台构建成功
- [ ] 版本号已更新
- [ ] Changelog 已更新
- [ ] 本地测试通过
- [ ] 各平台安装包测试通过
- [ ] 应用商店信息已准备
- [ ] 代码签名配置正确 (如需要)

---

**最后更新**: 2025-10-26 **维护者**: LyricNote Team
