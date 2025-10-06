# 🚀 CI/CD 打包方案分析

## 📋 当前状态

### ✅ 已有配置
- **现有Workflow**: `.github/workflows/deploy.yml`
  - 功能：构建Backend Docker镜像并部署
  - 触发：push到main分支或PR
  - 平台：Linux (ubuntu-latest)

### 📦 需要打包的端

#### 1. Desktop (Electron)
- **技术栈**: Electron + React + Vite
- **打包工具**: electron-builder
- **目标平台**: 
  - macOS (.dmg)
  - Windows (.exe, NSIS installer)
  - Linux (.AppImage)

#### 2. Mobile (React Native + Expo)
- **技术栈**: React Native + Expo
- **打包工具**: EAS Build
- **目标平台**:
  - iOS (.ipa)
  - Android (.apk / .aab)

---

## 🎯 方案一：扩展现有workflow（推荐）

### 优势
- ✅ 使用现有的pnpm和Node.js设置
- ✅ 可以复用shared包的构建流程
- ✅ 统一管理所有端的构建

### 实现方式

可以在现有的 `deploy.yml` 中添加新的job，或创建单独的workflow文件：

```yaml
# .github/workflows/deploy.yml (扩展现有)
# 或
# .github/workflows/build-apps.yml (新建)
```

---

## 📱 方案详解

## 一、Electron Desktop 打包

### 🔧 技术要点

#### 1. **electron-builder配置已存在**
```json
// packages/desktop/package.json
{
  "build": {
    "appId": "com.lyricnote.desktop",
    "productName": "",
    "directories": { "output": "release" },
    "mac": { "target": "dmg" },
    "win": { "target": "nsis" },
    "linux": { "target": "AppImage" }
  }
}
```

#### 2. **打包命令**
```bash
cd packages/desktop
pnpm build  # 或 pnpm electron:build
```

#### 3. **跨平台打包挑战**

| 平台 | 在哪里构建 | 说明 |
|------|-----------|------|
| **macOS** | macOS runner | 需要macOS系统签名 |
| **Windows** | Windows runner | 需要Windows环境 |
| **Linux** | Linux runner | 最简单 |

⚠️ **重要**: GitHub Actions提供了多平台runner

### 📝 Electron Workflow示例

```yaml
name: Build Desktop Apps

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'
  pull_request:
    branches: [ main ]

jobs:
  # Job 1: macOS构建
  build-macos:
    runs-on: macos-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: |
          pnpm install --frozen-lockfile
          pnpm build:shared
      
      - name: Build Electron App (macOS)
        run: |
          cd packages/desktop
          pnpm build
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload macOS artifacts
        uses: actions/upload-artifact@v3
        with:
          name: desktop-macos
          path: packages/desktop/release/*.dmg
  
  # Job 2: Windows构建
  build-windows:
    runs-on: windows-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: |
          pnpm install --frozen-lockfile
          pnpm build:shared
      
      - name: Build Electron App (Windows)
        run: |
          cd packages/desktop
          pnpm build
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Windows artifacts
        uses: actions/upload-artifact@v3
        with:
          name: desktop-windows
          path: packages/desktop/release/*.exe
  
  # Job 3: Linux构建
  build-linux:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: |
          pnpm install --frozen-lockfile
          pnpm build:shared
      
      - name: Build Electron App (Linux)
        run: |
          cd packages/desktop
          pnpm build
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Linux artifacts
        uses: actions/upload-artifact@v3
        with:
          name: desktop-linux
          path: packages/desktop/release/*.AppImage
```

### 🔐 代码签名（可选但推荐）

#### macOS签名
需要Apple Developer证书：
```yaml
- name: Import Certificate (macOS)
  uses: apple-actions/import-codesign-certs@v2
  with:
    p12-file-base64: ${{ secrets.MACOS_CERTIFICATE }}
    p12-password: ${{ secrets.MACOS_CERTIFICATE_PWD }}
```

#### Windows签名
需要代码签名证书：
```yaml
env:
  CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
```

---

## 二、React Native Mobile 打包

### 🔧 技术要点

#### 1. **EAS配置已存在**
```json
// packages/mobile/eas.json
{
  "build": {
    "development": { ... },
    "preview": { ... },
    "production": { ... }
  }
}
```

#### 2. **打包方式**

有两种方式：

##### 方式A: 使用EAS Build（推荐）⭐
- **优势**: 
  - Expo官方托管构建
  - 无需本地配置iOS/Android环境
  - 支持云端签名
  - 自动处理依赖和证书

- **限制**:
  - 需要Expo账号
  - 免费版有构建限制
  - 需要配置secrets

##### 方式B: 本地构建
- **优势**: 完全控制
- **劣势**: 需要配置复杂的环境

### 📝 EAS Build Workflow示例

```yaml
name: Build Mobile Apps (EAS)

on:
  push:
    branches: [ main ]
    tags:
      - 'mobile-v*'

jobs:
  build-mobile:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: |
          pnpm install --frozen-lockfile
          pnpm build:shared
      
      - name: Build Android (Preview)
        run: |
          cd packages/mobile
          eas build --platform android --profile preview --non-interactive
      
      - name: Build iOS (Preview)
        run: |
          cd packages/mobile
          eas build --platform ios --profile preview --non-interactive
```

### 🔑 需要的Secrets

#### EAS Build需要：
1. **EXPO_TOKEN**
   - 从 https://expo.dev/accounts/[username]/settings/access-tokens 获取
   - 添加到GitHub Secrets

2. **Apple Developer证书**（iOS）
   - 通过EAS配置或手动上传
   ```bash
   eas credentials
   ```

3. **Google Play证书**（Android）
   - EAS可以自动生成keystore
   - 或手动配置

---

## 🎯 完整方案架构

### 建议的Workflow结构

```
.github/workflows/
├── deploy.yml              # 现有的Backend部署（保持不变）
├── build-desktop.yml       # 新增：Desktop打包
├── build-mobile.yml        # 新增：Mobile打包
└── release.yml            # 可选：发布管理
```

### 触发策略

#### 1. **开发环境** (push到main)
```yaml
on:
  push:
    branches: [ main ]
```
- Backend: 自动部署
- Desktop: 构建但不发布（仅artifacts）
- Mobile: 构建preview版本

#### 2. **生产环境** (创建tag)
```yaml
on:
  push:
    tags:
      - 'v*'           # Backend和Desktop
      - 'mobile-v*'    # Mobile专用
```
- Backend: 部署生产环境
- Desktop: 构建并发布到GitHub Releases
- Mobile: 构建production版本

---

## 💰 成本考虑

### GitHub Actions分钟数

| Runner类型 | 消耗倍率 | 免费额度 |
|-----------|---------|---------|
| Linux | 1x | 2000分钟/月 |
| Windows | 2x | 1000分钟/月 |
| macOS | 10x | 200分钟/月 |

⚠️ **注意**: macOS构建非常消耗额度！

### Expo EAS Build

| 计划 | 价格 | 构建数 |
|-----|------|--------|
| Free | $0 | 30次/月 |
| Production | $29/月 | 无限 |
| Enterprise | 定制 | 无限 |

---

## 🚀 实施建议

### 阶段1: 基础打包（建议先做）

1. **添加Desktop Linux打包**
   - 成本低（Linux runner）
   - 配置简单
   - 快速验证流程

```yaml
# .github/workflows/build-desktop-linux.yml
# 只构建Linux版本，验证流程
```

2. **添加Mobile Preview打包**
   - 使用EAS Build
   - 只构建preview profile
   - 快速迭代

```yaml
# .github/workflows/build-mobile-preview.yml
```

### 阶段2: 完整打包

3. **添加macOS和Windows打包**
   - 需要时才添加
   - 注意runner成本

4. **添加Production构建**
   - 配置签名证书
   - 配置发布流程

### 阶段3: 自动发布

5. **集成GitHub Releases**
   - 自动创建release
   - 上传安装包

6. **集成App Store / Google Play**
   - 自动提交审核（可选）

---

## 📝 立即可以做的事

### ✅ 不需要修改代码，只需添加workflow文件

1. **创建 `.github/workflows/build-desktop-linux.yml`**
   - 在Linux上构建AppImage
   - 上传到Artifacts

2. **创建 `.github/workflows/build-mobile.yml`**
   - 使用EAS Build构建preview版本
   - 需要配置EXPO_TOKEN

### 🔧 需要配置的Secrets

```bash
# GitHub Settings > Secrets > Actions

# Mobile打包
EXPO_TOKEN=<your_expo_token>

# Desktop签名（可选，后期添加）
MACOS_CERTIFICATE=<base64_p12>
MACOS_CERTIFICATE_PWD=<password>
WIN_CSC_LINK=<base64_pfx>
WIN_CSC_KEY_PASSWORD=<password>
```

---

## 🎓 学习资源

### Electron打包
- [electron-builder文档](https://www.electron.build/)
- [GitHub Actions + Electron示例](https://github.com/electron/electron-quick-start/blob/master/.github/workflows/build.yml)

### React Native + EAS
- [EAS Build文档](https://docs.expo.dev/build/introduction/)
- [GitHub Actions + EAS](https://docs.expo.dev/build-reference/github-actions/)

---

## ❓ 常见问题

### Q1: 需要macOS电脑才能构建macOS应用吗？
**A**: 是的，但GitHub Actions提供macOS runner，在CI中可以直接使用。

### Q2: iOS构建需要Apple Developer账号吗？
**A**: 
- Simulator构建：不需要
- 真机构建：需要（$99/年）
- EAS可以帮助管理证书

### Q3: 构建时间多久？
**A**:
- Desktop (Linux): ~5分钟
- Desktop (macOS): ~10分钟
- Desktop (Windows): ~8分钟
- Mobile (EAS): ~15-20分钟

### Q4: 可以手动触发构建吗？
**A**: 可以，添加 `workflow_dispatch` 触发器：
```yaml
on:
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to build'
        required: true
        type: choice
        options:
          - macos
          - windows
          - linux
```

---

## 🎯 下一步行动

如果你想开始实施，我建议：

1. **先从简单的开始**
   ```bash
   # 添加Linux Desktop构建
   .github/workflows/build-desktop-linux.yml
   ```

2. **然后添加Mobile**
   ```bash
   # 配置EAS token
   # 添加Mobile构建
   .github/workflows/build-mobile.yml
   ```

3. **最后完善**
   - 添加其他平台
   - 配置签名
   - 自动发布

需要我帮你创建具体的workflow文件吗？我可以基于你的现有配置生成完整的YAML文件。

