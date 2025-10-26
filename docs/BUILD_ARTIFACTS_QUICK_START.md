# 📦 快速获取构建产物

## 🚀 一键构建所有平台

### 方法一: 手动触发 (推荐)

1. 访问
   [GitHub Actions](https://github.com/qxdqhr/LyricNote/actions/workflows/build-frontend.yml)
2. 点击右侧 **"Run workflow"** 按钮
3. 选择分支 (通常是 `main`)
4. 选择要构建的平台:
   - `all` - 构建所有平台 (默认)
   - `desktop` - 仅桌面端 (macOS + Windows)
   - `mobile` - 仅移动端 (iOS + Android)
   - `miniapp` - 仅微信小程序
5. 点击绿色 **"Run workflow"** 按钮

### 方法二: 推送代码自动触发

```bash
git push origin main
# 自动触发所有平台构建
```

---

## 📥 下载构建产物

### 步骤

1. 在 [Actions 页面](https://github.com/qxdqhr/LyricNote/actions)
   找到刚才的运行记录
2. 等待所有构建完成 (约 15-30 分钟)
3. 滚动到页面底部的 **"Artifacts"** 区域
4. 点击下载对应平台的产物

### 可用产物

| 产物名称                | 平台       | 格式   | 大小   | 说明                             |
| ----------------------- | ---------- | ------ | ------ | -------------------------------- |
| `miniapp-wechat-{sha}`  | 微信小程序 | `.zip` | ~2MB   | 小程序代码包                     |
| `desktop-macos-{sha}`   | macOS      | `.dmg` | ~100MB | macOS 安装包                     |
| `desktop-windows-{sha}` | Windows    | `.exe` | ~80MB  | Windows 安装程序                 |
| iOS (EAS Build)         | iOS        | `.ipa` | ~50MB  | 在 [Expo](https://expo.dev) 下载 |
| Android (EAS Build)     | Android    | `.apk` | ~30MB  | 在 [Expo](https://expo.dev) 下载 |

---

## 📱 移动端特殊说明

移动端使用 Expo EAS Build 云服务构建,需要额外配置:

### 首次使用配置

1. **创建 Expo 账号**: https://expo.dev/signup
2. **获取 Access Token**:
   https://expo.dev/accounts/[username]/settings/access-tokens
3. **配置到 GitHub Secrets**:
   - 访问仓库 Settings → Secrets and variables → Actions
   - 新建 Secret: `EXPO_TOKEN`
   - 粘贴你的 token

### 查看构建进度

- 访问 https://expo.dev/accounts/[username]/projects/lyricnote/builds
- 查看实时构建状态和日志
- 构建完成后可直接下载

### 未配置的情况

如果未配置 `EXPO_TOKEN`,移动端构建会被跳过,但不影响其他平台。

---

## 📦 产物使用方式

### 微信小程序

1. 下载 `miniapp-wechat-{sha}.zip`
2. 解压缩
3. 用微信开发者工具打开解压后的目录
4. 预览或上传到微信公众平台

### macOS Desktop

1. 下载 `.dmg` 文件
2. 双击打开
3. 拖拽到 Applications 文件夹
4. 首次打开可能需要在"系统偏好设置 → 安全性与隐私"中允许

### Windows Desktop

1. 下载 `.exe` 文件
2. 双击运行安装向导
3. 按提示完成安装
4. Windows Defender 可能会弹出警告,选择"仍要运行"

### iOS Mobile

1. 从 Expo Dashboard 下载 `.ipa` 文件
2. 使用 TestFlight 进行内部测试
3. 或使用 Xcode 安装到真机

### Android Mobile

1. 从 Expo Dashboard 下载 `.apk` 文件
2. 在 Android 设备上直接安装
3. 可能需要在设置中允许"未知来源"应用

---

## ⏱️ 构建时间

| 平台            | 预计时间            |
| --------------- | ------------------- |
| 微信小程序      | ~3 分钟             |
| Desktop macOS   | ~8 分钟             |
| Desktop Windows | ~8 分钟             |
| Mobile iOS      | ~15 分钟 (EAS 云端) |
| Mobile Android  | ~10 分钟 (EAS 云端) |

**总计**: 约 20-30 分钟 (所有平台并行构建)

---

## 🐛 常见问题

### Q: Artifacts 在哪里?

**A**: 在 Actions 运行页面的最底部,Artifacts 区域。

### Q: 为什么没有看到移动端产物?

**A**: 移动端使用 EAS Build,需要到 https://expo.dev 查看和下载。

### Q: 构建失败怎么办?

**A**:

1. 点击失败的 job 查看详细日志
2. 常见问题:
   - 依赖安装失败 → 更新 `pnpm-lock.yaml`
   - 编译错误 → 检查代码是否通过本地测试
   - 超时 → 重新运行 workflow

### Q: 如何只构建某个平台?

**A**: 手动触发时在 `platforms` 参数选择具体平台。

### Q: 产物保留多久?

**A**:

- 普通构建: 30 天
- Tag 发布: 90 天
- PR 构建: 7 天

---

## 🔗 相关链接

- [详细构建指南](./FRONTEND_BUILD_GUIDE.md)
- [GitHub Actions](https://github.com/qxdqhr/LyricNote/actions)
- [Expo Dashboard](https://expo.dev)

---

**提示**: 首次构建可能需要更长时间,后续构建会因为缓存而加速。
