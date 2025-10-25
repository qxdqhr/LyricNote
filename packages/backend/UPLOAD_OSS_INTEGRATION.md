# 图片上传 OSS 集成说明

## ✅ 已完成集成

首页配置的图片上传已集成阿里云 OSS，支持自动读取配置管理中的 OSS 设置。

---

## 🔄 上传流程

### 智能存储选择

```
用户上传图片
    ↓
读取配置管理中的 OSS 配置
    ↓
┌─────────────────┐
│ OSS 配置完整？   │
└────┬──────┬─────┘
     │ YES  │ NO
     ↓      ↓
  上传到OSS  上传到本地
     ↓      ↓
  OSS URL  本地URL
     ↓      ↓
  保存到数据库
```

---

## 🔧 配置管理集成

### 读取的配置项

从**配置管理 → 存储配置**中读取：

| 配置键                  | 说明                       | 必需 |
| ----------------------- | -------------------------- | ---- |
| `oss_region`            | OSS 区域（如 cn-hangzhou） | ✅   |
| `oss_bucket_name`       | OSS 存储桶名称             | ✅   |
| `oss_access_key_id`     | OSS 访问密钥 ID            | ✅   |
| `oss_access_key_secret` | OSS 访问密钥 Secret        | ✅   |
| `oss_endpoint`          | OSS 自定义端点（可选）     | ⭕   |

---

## 📋 配置步骤

### 1. 进入配置管理

```
登录后台 → 系统配置 → 存储配置
```

### 2. 填写 OSS 配置

**必填项：**

- **OSS区域**: `cn-hangzhou` (或其他区域)
- **OSS存储桶名称**: `your-bucket-name`
- **OSS访问密钥ID**: `LTAI5t...`
- **OSS访问密钥Secret**: `your-secret-key`

**可选项：**

- **OSS服务端点**: 自定义域名（如 `oss-cn-hangzhou.aliyuncs.com`）

### 3. 保存配置

点击"保存配置"按钮，配置立即生效。

### 4. 测试上传

- 进入"首页配置"
- 点击"添加配置"或"编辑"
- 上传背景图片
- 查看服务器日志确认使用的存储方式

---

## 🔍 验证配置

### 检查日志

上传图片时，服务器会输出日志：

**使用 OSS 存储：**

```
✅ OSS 配置已加载: {
  region: 'cn-hangzhou',
  bucket: 'your-bucket',
  hasAccessKey: true,
  hasSecret: true
}
✅ 使用 OSS 存储
```

**使用本地存储：**

```
ℹ️ OSS 配置不完整，将使用本地存储
ℹ️ 使用本地存储
```

---

## 📁 存储路径

### OSS 存储路径

```
bucket-name/
  └── homepage/
      └── backgrounds/
          ├── 1730012345-abc123-a1b2c3d4.jpg
          ├── 1730012456-def456-e5f6g7h8.png
          └── 1730012567-ghi789-i9j0k1l2.webp
```

**访问 URL：**

```
https://your-bucket.cn-hangzhou.aliyuncs.com/homepage/backgrounds/xxx.jpg
```

### 本地存储路径

```
public/
  └── uploads/
      └── homepage/
          └── backgrounds/
              └── xxx.jpg
```

**访问 URL：**

```
/uploads/homepage/backgrounds/xxx.jpg
```

---

## 🔐 安全性

### 敏感信息保护

- ✅ `oss_access_key_secret` 标记为敏感信息
- ✅ 在配置界面中隐藏显示
- ✅ 只在服务器端读取，不发送到客户端
- ✅ 日志中不输出完整的密钥

### 权限控制

- 只有管理员可以修改 OSS 配置
- 配置修改有审计日志

---

## 💡 代码实现

### API 路由 (`/api/upload/image`)

```typescript
// 1. 读取 OSS 配置
const ossConfig = await getOSSConfig();

// 2. 智能选择存储方式
if (ossConfig) {
  // 上传到 OSS
  url = await uploadToOSS(buffer, filename, ossConfig);
  storageType = 'oss';
} else {
  // 上传到本地
  url = await uploadToLocal(buffer, filename);
  storageType = 'local';
}

// 3. 返回结果
return {
  url, // 图片访问 URL
  filename, // 文件名
  storageType, // 存储类型（oss 或 local）
  size, // 文件大小
  type, // MIME 类型
};
```

### 配置读取

```typescript
async function getOSSConfig() {
  const { ConfigService } = await import('@/lib/config/config-service');
  const configService = ConfigService.getInstance();

  // 从数据库读取存储配置
  const storageConfigs = await configService.getConfigsByCategory('storage');

  // 提取 OSS 配置
  const ossConfig = {
    region: storageConfigs.find((c) => c.key === 'oss_region')?.value,
    bucket: storageConfigs.find((c) => c.key === 'oss_bucket_name')?.value,
    accessKeyId: storageConfigs.find((c) => c.key === 'oss_access_key_id')
      ?.value,
    accessKeySecret: storageConfigs.find(
      (c) => c.key === 'oss_access_key_secret'
    )?.value,
    endpoint: storageConfigs.find((c) => c.key === 'oss_endpoint')?.value,
  };

  // 验证配置完整性
  if (
    ossConfig.region &&
    ossConfig.bucket &&
    ossConfig.accessKeyId &&
    ossConfig.accessKeySecret
  ) {
    return ossConfig;
  }

  return null;
}
```

---

## 🚀 使用示例

### 场景 1：已配置 OSS

1. **配置 OSS**

   ```
   oss_region: cn-hangzhou
   oss_bucket_name: my-bucket
   oss_access_key_id: LTAI5t...
   oss_access_key_secret: secret...
   ```

2. **上传图片**
   - 图片自动上传到阿里云 OSS
   - 返回 OSS
     URL：`https://my-bucket.cn-hangzhou.aliyuncs.com/homepage/backgrounds/xxx.jpg`

3. **前台展示**
   - 首页使用 OSS URL 显示图片
   - 享受 OSS 的 CDN 加速

### 场景 2：未配置 OSS

1. **不配置或配置不完整**

2. **上传图片**
   - 图片自动保存到本地
   - 返回本地 URL：`/uploads/homepage/backgrounds/xxx.jpg`

3. **前台展示**
   - 首页使用本地 URL 显示图片
   - 适合开发和测试环境

---

## 🎯 优势

### 1. **零配置开发**

- 开发环境不需要配置 OSS
- 自动使用本地存储
- 开发体验流畅

### 2. **生产环境 OSS**

- 配置 OSS 后自动切换
- 享受云存储优势
- 支持 CDN 加速

### 3. **无缝切换**

- 配置和代码解耦
- 随时修改配置
- 无需重启服务

### 4. **智能降级**

- OSS 不可用时自动降级到本地
- 保证服务可用性
- 错误日志记录

---

## 🔧 故障排查

### OSS 上传失败

**问题：** 配置了 OSS 但上传失败

**排查步骤：**

1. **检查配置**

   ```bash
   # 查看配置
   SELECT * FROM configs WHERE category = 'storage' AND key LIKE 'oss_%';
   ```

2. **验证凭证**
   - 确认 AccessKey ID 和 Secret 正确
   - 检查权限是否包含 `PutObject`

3. **检查网络**
   - 确认服务器可以访问 OSS 端点
   - 检查防火墙规则

4. **查看日志**
   ```bash
   # 查看上传日志
   tail -f logs/backend.log | grep "OSS"
   ```

### 配置读取失败

**问题：** 无法读取 OSS 配置

**解决方案：**

1. 确认配置项存在于数据库
2. 检查配置服务是否正常初始化
3. 查看错误日志

---

## 📊 性能对比

| 存储方式     | 上传速度 | 访问速度  | 成本 | 适用场景  |
| ------------ | -------- | --------- | ---- | --------- |
| **本地存储** | 快       | 一般      | 低   | 开发/测试 |
| **OSS 存储** | 一般     | 快（CDN） | 中   | 生产环境  |

---

## 🎊 总结

### 已实现功能

✅ 自动读取配置管理中的 OSS 配置 ✅ 智能选择存储方式（OSS/本地）✅
OSS 上传（使用 ali-oss
SDK）✅ 本地上传（文件系统）✅ 错误处理和日志记录 ✅ 配置热更新（无需重启）

### 使用流程

```
1. 配置管理 → 存储配置 → 填写 OSS 配置
2. 首页配置 → 上传背景图片
3. 自动上传到 OSS（如已配置）
4. 前台展示 OSS URL 的图片
```

---

**状态：** 🎉 **已完成并可使用**

**维护团队：** LyricNote Team **更新时间：** 2024-10-25
