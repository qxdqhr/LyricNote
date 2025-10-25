# 微信登录和支付账号申请指南

本文档指导你如何申请和配置微信相关账号，以便在 LyricNote 项目中集成微信登录和支付功能。

---

## 一、微信开放平台账号申请（网页和 APP 登录）

### 1. 注册微信开放平台账号

1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 点击右上角"注册"，使用邮箱注册账号
3. 完成邮箱验证和账号信息填写

### 2. 创建网站应用（用于网页登录）

1. 登录微信开放平台
2. 进入"管理中心" → "网站应用"
3. 点击"创建网站应用"
4. 填写应用信息：
   - **应用名称**: LyricNote
   - **应用简介**: 音乐歌词管理平台
   - **应用官网**: https://your-domain.com
   - **授权回调域**: https://your-domain.com/api/auth/wechat/callback
5. 提交审核（一般 1-7 个工作日）
6. 审核通过后获得：
   - **AppID**: 记录下来，配置为 `wechat_web_appid`
   - **AppSecret**: 记录下来，配置为 `wechat_web_appsecret`

### 3. 创建移动应用（用于 APP 登录）

1. 进入"管理中心" → "移动应用"
2. 点击"创建移动应用"
3. 填写应用信息：
   - **应用名称**: LyricNote
   - **应用平台**: iOS / Android
   - **应用包名**: com.lyricnote.app (Android)
   - **Bundle ID**: com.lyricnote.app (iOS)
   - **应用签名**: 根据平台生成
4. 提交审核
5. 审核通过后获得：
   - **AppID**: 配置为 `wechat_mobile_appid`
   - **AppSecret**: 配置为 `wechat_mobile_appsecret`

---

## 二、微信公众平台账号申请（小程序）

### 1. 注册小程序账号

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 点击"立即注册" → 选择"小程序"
3. 填写账号信息（需要未注册过微信的邮箱）
4. 完成邮箱激活
5. 选择主体类型（个人/企业）
6. 完成主体信息登记
7. 完成管理员身份验证

### 2. 完善小程序信息

1. 登录小程序后台
2. 进入"设置" → "基本设置"
3. 填写小程序信息：
   - **小程序名称**: LyricNote
   - **小程序简介**: 音乐歌词管理小程序
   - **类目**: 工具 → 其他
4. 上传小程序头像和介绍图

### 3. 获取小程序密钥

1. 进入"开发" → "开发管理" → "开发设置"
2. 找到"开发者ID"：
   - **AppID**: 配置为 `wechat_miniapp_appid`
   - **AppSecret**: 点击"生成"或"重置"，配置为 `wechat_miniapp_appsecret`
     ⚠️ **重要**：AppSecret 生成后只显示一次，请立即保存

### 4. 配置服务器域名

1. 进入"开发" → "开发管理" → "开发设置" → "服务器域名"
2. 配置以下域名（需要已备案）：
   - **request 合法域名**: https://your-api-domain.com
   - **uploadFile 合法域名**: https://your-api-domain.com
   - **downloadFile 合法域名**: https://your-api-domain.com

---

## 三、微信商户平台账号申请（支付功能）

### 1. 申请微信支付商户号

**前置条件**：
- 必须已有企业营业执照（个人无法申请）
- 已有对公银行账户
- 已完成微信认证

**申请步骤**：
1. 登录微信公众平台或微信开放平台
2. 进入"微信支付" → "开通"
3. 选择"申请接入"
4. 填写商户资料：
   - **商户简称**: LyricNote
   - **客服电话**: 客服联系方式
   - **经营类目**: 根据实际业务选择
   - **营业执照**: 上传营业执照照片
   - **法人身份证**: 上传法人身份证照片
   - **结算银行卡**: 填写对公账户信息
5. 提交申请（一般 1-5 个工作日审核）
6. 审核通过后，签约并激活商户号

### 2. 获取商户号和 API 密钥

审核通过后，你会收到邮件通知，包含：
- **商户号 (mch_id)**: 配置为 `wechat_mch_id`

获取 API 密钥：
1. 登录 [微信支付商户平台](https://pay.weixin.qq.com/)
2. 进入"账户中心" → "API安全" → "API密钥"
3. 点击"设置密钥"（首次）或"修改密钥"
4. 输入 32 位的密钥（建议使用随机生成工具）
5. 保存密钥，配置为 `wechat_mch_key`
   ⚠️ **重要**：密钥设置后无法查看，请务必保存

### 3. 下载商户证书

1. 进入"账户中心" → "API安全" → "API证书"
2. 点击"申请证书"
3. 按照提示安装证书工具
4. 生成并下载证书文件：
   - `apiclient_cert.pem` (商户证书)
   - `apiclient_key.pem` (商户私钥)
5. 将证书文件保存到服务器安全目录
6. 配置证书路径为 `wechat_cert_path`

**推荐存放路径**：
```
/path/to/your/project/certs/wechat/
  ├── apiclient_cert.pem
  └── apiclient_key.pem
```

### 4. 配置支付回调 URL

1. 进入"产品中心" → "开发配置"
2. 设置"支付结果通知URL"：
   ```
   https://your-api-domain.com/api/payment/wechat/notify
   ```
3. ⚠️ **必须使用 HTTPS**

### 5. 关联应用

为了让应用能够使用微信支付，需要关联：

**网页支付**：
1. 进入"产品中心" → "JSAPI支付"
2. 添加支付授权目录：`https://your-domain.com/payment/`

**小程序支付**：
1. 进入"产品中心" → "AppID账号管理"
2. 关联小程序 AppID

**APP 支付**：
1. 进入"产品中心" → "AppID账号管理"
2. 关联移动应用 AppID

---

## 四、配置 IP 白名单

为了安全，微信要求配置服务器 IP 白名单。

### 1. 获取服务器 IP

```bash
# 查看服务器公网 IP
curl ifconfig.me
```

### 2. 配置白名单

**微信支付商户平台**：
1. 登录商户平台
2. 进入"账户中心" → "API安全" → "IP白名单"
3. 添加你的服务器 IP

**微信公众平台（小程序）**：
1. 登录小程序后台
2. 进入"开发" → "开发管理" → "开发设置" → "服务器域名"
3. 添加服务器 IP

---

## 五、配置汇总表

申请完成后，将以下信息填入 LyricNote 配置管理系统：

| 配置项 | 说明 | 获取位置 | 是否敏感 |
|--------|------|----------|----------|
| `wechat_web_appid` | 网页应用 AppID | 微信开放平台 - 网站应用 | 否 |
| `wechat_web_appsecret` | 网页应用 AppSecret | 微信开放平台 - 网站应用 | 是 |
| `wechat_miniapp_appid` | 小程序 AppID | 微信公众平台 - 小程序 | 否 |
| `wechat_miniapp_appsecret` | 小程序 AppSecret | 微信公众平台 - 小程序 | 是 |
| `wechat_mobile_appid` | 移动应用 AppID | 微信开放平台 - 移动应用 | 否 |
| `wechat_mobile_appsecret` | 移动应用 AppSecret | 微信开放平台 - 移动应用 | 是 |
| `wechat_mch_id` | 微信支付商户号 | 微信支付商户平台 | 否 |
| `wechat_mch_key` | 商户 API 密钥 | 微信支付商户平台 - API安全 | 是 |
| `wechat_cert_path` | 商户证书路径 | 微信支付商户平台 - API证书 | 否 |

---

## 六、测试环境配置

### 1. 开发者工具

**小程序开发**：
- 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 使用小程序 AppID 登录调试

**网页开发**：
- 使用测试账号进行调试
- 微信开放平台提供测试号申请

### 2. 沙箱环境

微信支付提供沙箱环境用于测试：
1. 登录商户平台
2. 进入"账户中心" → "API安全" → "沙箱环境"
3. 获取沙箱商户号和密钥
4. 在开发环境使用沙箱配置

---

## 七、常见问题

### Q1: 审核需要多久？
- 网站应用/移动应用：1-7 个工作日
- 微信支付商户：1-5 个工作日
- 小程序首次发布：1-3 个工作日

### Q2: 个人可以申请微信支付吗？
不可以。微信支付需要企业资质，个人只能申请小程序，但无法开通支付功能。

### Q3: 测试环境如何配置？
建议使用微信提供的测试号和沙箱环境进行开发测试。

### Q4: AppSecret 忘记了怎么办？
AppSecret 忘记后无法找回，只能重置。重置后需要更新系统配置。

### Q5: 回调 URL 必须使用 HTTPS 吗？
是的，微信支付回调必须使用 HTTPS，建议所有接口都使用 HTTPS。

---

## 八、相关链接

- [微信开放平台](https://open.weixin.qq.com/)
- [微信公众平台](https://mp.weixin.qq.com/)
- [微信支付商户平台](https://pay.weixin.qq.com/)
- [微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)
- [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信登录开发文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)

---

## 九、安全建议

1. ✅ **保护密钥**：AppSecret 和 API 密钥绝不能泄露，不要提交到代码仓库
2. ✅ **使用环境变量**：生产环境使用环境变量或密钥管理服务
3. ✅ **证书安全**：商户证书文件权限设置为仅服务器进程可读
4. ✅ **HTTPS**：所有接口使用 HTTPS，特别是支付相关
5. ✅ **IP 白名单**：及时更新 IP 白名单，限制访问来源
6. ✅ **日志脱敏**：日志中不记录完整的密钥和敏感信息
7. ✅ **定期更新**：定期更换 API 密钥，降低泄露风险

---

完成以上步骤后，你就可以开始在 LyricNote 项目中集成微信登录和支付功能了！

