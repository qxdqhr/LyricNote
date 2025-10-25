# 微信登录和支付开发指南

本文档面向开发者，详细说明如何在 LyricNote 项目中使用微信登录和支付功能。

---

## 目录

- [快速开始](#快速开始)
- [API 接口文档](#api-接口文档)
- [各端集成示例](#各端集成示例)
- [数据库结构](#数据库结构)
- [类型定义](#类型定义)
- [调试技巧](#调试技巧)
- [常见错误处理](#常见错误处理)

---

## 快速开始

### 1. 安装依赖

```bash
# Backend
cd packages/backend
pnpm install axios qrcode.react

# Miniapp (已包含 Taro 内置微信 API)
cd packages/miniapp
pnpm install

# Mobile
cd packages/mobile
pnpm install react-native-wechat-lib
```

### 2. 配置微信账号

参考 [WECHAT_SETUP_GUIDE.md](./WECHAT_SETUP_GUIDE.md) 完成微信账号申请。

### 3. 在配置管理中填写微信配置

登录后台管理系统 -> 配置管理 -> 微信配置，填写：

- `wechat_web_appid`: 网页应用 AppID
- `wechat_web_appsecret`: 网页应用 AppSecret
- `wechat_miniapp_appid`: 小程序 AppID
- `wechat_miniapp_appsecret`: 小程序 AppSecret
- `wechat_mobile_appid`: 移动应用 AppID
- `wechat_mobile_appsecret`: 移动应用 AppSecret
- `wechat_mch_id`: 商户号
- `wechat_mch_key`: 商户 API 密钥
- `wechat_cert_path`: 商户证书路径
- `wechat_notify_url`: 支付回调 URL

### 4. 应用数据库迁移

```bash
cd packages/backend
pnpm drizzle-kit push
```

这将创建以下表：

- `user_wechat_bindings` - 微信绑定表
- `payment_orders` - 支付订单表
- `payment_logs` - 支付日志表

---

## API 接口文档

### 登录相关 API

#### 1. 微信登录

**接口**: `POST /api/auth/wechat/login`

**请求参数**:

```json
{
  "platform": "web | miniapp | mobile",
  "code": "微信授权码",
  "state": "状态参数（可选）"
}
```

**响应示例**:

```json
{
  "success": true,
  "userId": "user_123",
  "token": "auth_token_xxx",
  "userInfo": {
    "openid": "xxx",
    "nickname": "张三",
    "avatar": "https://..."
  },
  "isNewUser": false
}
```

#### 2. 网页登录回调

**接口**: `GET /api/auth/wechat/callback?code=xxx&state=xxx`

**说明**: 微信扫码登录后的回调接口，会自动设置 cookie 并重定向到首页。

#### 3. 绑定微信账号

**接口**: `POST /api/auth/wechat/bind`

**请求参数**:

```json
{
  "userId": "user_123",
  "platform": "web | miniapp | mobile",
  "code": "微信授权码"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "绑定成功",
  "wechatUserInfo": {
    "openid": "xxx",
    "nickname": "张三",
    "avatar": "https://..."
  }
}
```

#### 4. 解绑微信账号

**接口**: `POST /api/auth/wechat/unbind`

**请求参数**:

```json
{
  "userId": "user_123",
  "platform": "web | miniapp | mobile"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "解绑成功"
}
```

---

### 支付相关 API

#### 1. 创建支付订单

**接口**: `POST /api/payment/wechat/create`

**请求参数**:

```json
{
  "userId": "user_123",
  "platform": "web | miniapp | mobile",
  "amount": 1000,
  "productName": "VIP会员",
  "productId": "product_001",
  "description": "购买VIP会员1个月",
  "openid": "xxx" // 小程序支付必需
}
```

**响应示例**:

**网页支付 (Native)**:

```json
{
  "success": true,
  "orderId": "WX1234567890",
  "codeUrl": "weixin://wxpay/bizpayurl?pr=xxx",
  "prepayId": "prepay_xxx"
}
```

**小程序/APP 支付**:

```json
{
  "success": true,
  "orderId": "WX1234567890",
  "prepayId": "prepay_xxx",
  "paymentParams": {
    "appId": "xxx",
    "timeStamp": "1234567890",
    "nonceStr": "xxx",
    "package": "prepay_id=xxx",
    "signType": "MD5",
    "paySign": "xxx"
  }
}
```

#### 2. 支付回调通知

**接口**: `POST /api/payment/wechat/notify`

**说明**: 此接口由微信服务器调用，用于通知支付结果。开发者无需直接调用。

#### 3. 查询订单状态

**接口**: `GET /api/payment/wechat/query/:orderId`

**响应示例**:

```json
{
  "success": true,
  "order": {
    "orderId": "WX1234567890",
    "userId": "user_123",
    "platform": "wechat",
    "tradeType": "NATIVE",
    "amount": 1000,
    "productName": "VIP会员",
    "status": "paid",
    "transactionId": "4200001234567890",
    "paymentTime": "2025-01-01T12:00:00",
    "createdAt": "2025-01-01T11:55:00"
  }
}
```

#### 4. 申请退款

**接口**: `POST /api/payment/wechat/refund`

**请求参数**:

```json
{
  "orderId": "WX1234567890",
  "refundAmount": 1000, // 可选，不填则全额退款
  "reason": "用户申请退款"
}
```

**响应示例**:

```json
{
  "success": true,
  "refundId": "REFUND_WX1234567890"
}
```

#### 5. 获取用户订单列表

**接口**:
`GET /api/payment/wechat/orders?userId=xxx&page=1&pageSize=20&status=paid`

**响应示例**:

```json
{
  "success": true,
  "orders": [...],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

---

## 各端集成示例

### Backend Web 端

#### 登录组件使用

```tsx
import { WechatLogin } from '@/components/wechat-login';

function LoginPage() {
  const handleSuccess = (data: any) => {
    console.log('登录成功:', data);
    // 跳转到首页或其他页面
  };

  const handleError = (error: string) => {
    console.error('登录失败:', error);
  };

  return (
    <div>
      <h1>微信登录</h1>
      <WechatLogin onSuccess={handleSuccess} onError={handleError} size={256} />
    </div>
  );
}
```

#### 支付组件使用

```tsx
import { WechatPayment } from '@/components/wechat-payment';

function PaymentPage() {
  const handleSuccess = (orderId: string) => {
    console.log('支付成功:', orderId);
    // 跳转到成功页面
  };

  return (
    <div>
      <WechatPayment
        userId="user_123"
        amount={9900} // 99.00 元
        productName="VIP会员"
        productId="vip_month"
        description="购买VIP会员1个月"
        onSuccess={handleSuccess}
      />
    </div>
  );
}
```

---

### Miniapp 小程序端

#### 登录

```tsx
import Taro from '@tarojs/taro';
import { wechatLogin } from '@/services/wechat-auth';

function LoginPage() {
  const handleLogin = async () => {
    const result = await wechatLogin();

    if (result.success) {
      console.log('登录成功');
      Taro.navigateTo({ url: '/pages/index/index' });
    } else {
      Taro.showToast({
        title: result.error || '登录失败',
        icon: 'none',
      });
    }
  };

  return (
    <view>
      <button onClick={handleLogin}>微信登录</button>
    </view>
  );
}
```

#### 支付

```tsx
import Taro from '@tarojs/taro';
import { wechatPay } from '@/services/wechat-payment';

function PaymentPage() {
  const handlePay = async () => {
    const result = await wechatPay({
      userId: 'user_123',
      amount: 9900,
      productName: 'VIP会员',
      description: '购买VIP会员1个月',
    });

    if (result.success) {
      Taro.showToast({
        title: '支付成功',
        icon: 'success',
      });
      // 跳转到成功页面
    } else {
      Taro.showToast({
        title: result.error || '支付失败',
        icon: 'none',
      });
    }
  };

  return (
    <view>
      <button onClick={handlePay}>立即支付</button>
    </view>
  );
}
```

---

### Mobile 移动端

#### 登录

```tsx
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { wechatLogin, isWechatInstalled } from '@/services/wechat-auth';

function LoginScreen() {
  const handleLogin = async () => {
    // 检查是否安装微信
    const installed = await isWechatInstalled();
    if (!installed) {
      Alert.alert('提示', '请先安装微信');
      return;
    }

    const result = await wechatLogin();

    if (result.success) {
      console.log('登录成功');
      // 导航到首页
    } else {
      Alert.alert('登录失败', result.error);
    }
  };

  return (
    <View>
      <Button title="微信登录" onPress={handleLogin} />
    </View>
  );
}
```

#### 支付

```tsx
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { wechatPay } from '@/services/wechat-payment';

function PaymentScreen() {
  const handlePay = async () => {
    const result = await wechatPay({
      userId: 'user_123',
      amount: 9900,
      productName: 'VIP会员',
      description: '购买VIP会员1个月',
    });

    if (result.success) {
      Alert.alert('支付成功', `订单号: ${result.orderId}`);
    } else {
      Alert.alert('支付失败', result.error);
    }
  };

  return (
    <View>
      <Button title="立即支付" onPress={handlePay} />
    </View>
  );
}
```

---

## 数据库结构

### user_wechat_bindings 表

| 字段          | 类型      | 说明                     |
| ------------- | --------- | ------------------------ |
| id            | INTEGER   | 主键                     |
| user_id       | TEXT      | 用户 ID (外键)           |
| platform      | ENUM      | 平台：web/miniapp/mobile |
| openid        | TEXT      | 微信 openid              |
| unionid       | TEXT      | 微信 unionid             |
| nickname      | TEXT      | 昵称                     |
| avatar        | TEXT      | 头像                     |
| access_token  | TEXT      | 访问令牌                 |
| refresh_token | TEXT      | 刷新令牌                 |
| expires_at    | TIMESTAMP | 过期时间                 |
| created_at    | TIMESTAMP | 创建时间                 |
| updated_at    | TIMESTAMP | 更新时间                 |

**索引**:

- `user_platform_key` (user_id, platform) - 唯一
- `platform_openid_key` (platform, openid) - 唯一
- `user_id_idx` (user_id)
- `unionid_idx` (unionid)

### payment_orders 表

| 字段           | 类型      | 说明                                      |
| -------------- | --------- | ----------------------------------------- |
| id             | INTEGER   | 主键                                      |
| order_id       | TEXT      | 订单号（唯一）                            |
| user_id        | TEXT      | 用户 ID (外键)                            |
| platform       | TEXT      | 支付平台：wechat                          |
| trade_type     | ENUM      | 支付类型：JSAPI/NATIVE/APP/MWEB           |
| amount         | INTEGER   | 金额（单位：分）                          |
| currency       | TEXT      | 货币类型                                  |
| product_id     | TEXT      | 商品 ID                                   |
| product_name   | TEXT      | 商品名称                                  |
| description    | TEXT      | 商品描述                                  |
| status         | ENUM      | 订单状态：pending/paid/cancelled/refunded |
| transaction_id | TEXT      | 微信支付订单号                            |
| prepay_id      | TEXT      | 预支付 ID                                 |
| payment_time   | TIMESTAMP | 支付完成时间                              |
| callback_data  | JSONB     | 回调数据                                  |
| notify_count   | INTEGER   | 回调通知次数                              |
| client_ip      | TEXT      | 客户端 IP                                 |
| created_at     | TIMESTAMP | 创建时间                                  |
| updated_at     | TIMESTAMP | 更新时间                                  |

**索引**:

- `order_id` - 唯一
- `user_id_idx` (user_id)
- `status_idx` (status)
- `transaction_id_idx` (transaction_id)
- `created_at_idx` (created_at DESC)

### payment_logs 表

| 字段          | 类型      | 说明                                 |
| ------------- | --------- | ------------------------------------ |
| id            | INTEGER   | 主键                                 |
| order_id      | TEXT      | 订单号                               |
| action        | TEXT      | 操作类型：create/notify/query/refund |
| request_data  | JSONB     | 请求数据                             |
| response_data | JSONB     | 响应数据                             |
| status        | TEXT      | 状态：success/failed                 |
| error_message | TEXT      | 错误信息                             |
| created_at    | TIMESTAMP | 创建时间                             |

**索引**:

- `order_id_idx` (order_id)
- `action_idx` (action)
- `created_at_idx` (created_at DESC)

---

## 类型定义

详细类型定义请参考：

- `packages/shared/src/wechat/types.ts` - 微信相关类型
- `packages/shared/src/wechat/utils.ts` - 微信工具函数

主要类型包括：

- `WechatLoginParams` - 登录参数
- `WechatUserInfo` - 用户信息
- `PaymentCreateParams` - 创建支付参数
- `PaymentResult` - 支付结果
- `PaymentOrder` - 订单信息
- `WechatPaymentNotify` - 支付回调通知

---

## 调试技巧

### 1. 日志查看

所有微信相关操作都有详细日志，可以在后台日志中查看：

```bash
# Backend 日志
tail -f packages/backend/logs/app.log | grep Wechat
```

### 2. 测试环境配置

开发环境可以使用微信测试号和沙箱环境：

- 网页/移动应用：申请测试号
- 小程序：使用开发者工具
- 微信支付：使用沙箱环境

### 3. 使用 Postman 测试 API

导入 API 接口到 Postman 进行测试：

```json
{
  "url": "http://localhost:3000/api/auth/wechat/login",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "platform": "web",
    "code": "test_code_123"
  }
}
```

### 4. 查看数据库记录

```sql
-- 查看微信绑定记录
SELECT * FROM user_wechat_bindings WHERE user_id = 'user_123';

-- 查看支付订单
SELECT * FROM payment_orders WHERE user_id = 'user_123' ORDER BY created_at DESC;

-- 查看支付日志
SELECT * FROM payment_logs WHERE order_id = 'WX1234567890' ORDER BY created_at DESC;
```

---

## 常见错误处理

### 1. 签名错误 (SIGNERROR)

**原因**: 商户密钥配置错误或参数拼接不正确。

**解决方案**:

- 检查 `wechat_mch_key` 配置是否正确（32位）
- 确保参数按字典序排列
- 检查是否过滤了空值和 sign 字段

### 2. AppID 不存在 (APPID_NOT_EXIST)

**原因**: AppID 配置错误或未在微信平台注册。

**解决方案**:

- 检查对应平台的 AppID 配置
- 确认 AppID 已通过审核

### 3. 商户订单号重复 (OUT_TRADE_NO_USED)

**原因**: 订单号重复使用。

**解决方案**:

- 使用 `generateOrderId()` 生成唯一订单号
- 检查数据库是否有重复订单号

### 4. 回调通知失败

**原因**: 回调 URL 配置错误、签名验证失败或服务器不可达。

**解决方案**:

- 确保 `wechat_notify_url` 配置正确且使用 HTTPS
- 检查签名验证逻辑
- 确保服务器 IP 在白名单中
- 检查日志中的回调记录

### 5. 小程序获取不到 openid

**原因**: code 已使用或过期、AppID/AppSecret 配置错误。

**解决方案**:

- 每次登录重新调用 `wx.login()` 获取新 code
- code 只能使用一次，5分钟内有效
- 检查小程序 AppID 和 AppSecret 配置

---

## 性能优化建议

1. **支付状态轮询**: 前端查询订单状态时，建议使用指数退避策略，避免频繁请求。

2. **缓存用户信息**: 微信用户信息可以缓存到本地，减少接口调用。

3. **异步处理回调**: 支付回调中的业务逻辑应异步处理，避免阻塞微信服务器。

4. **数据库索引**: 确保订单表的查询字段都有索引，提高查询性能。

---

## 安全建议

1. ✅ **密钥保护**: AppSecret 和 API 密钥必须加密存储，不得明文保存
2. ✅ **HTTPS**: 所有接口必须使用 HTTPS，特别是支付相关
3. ✅ **签名验证**: 支付回调必须验证签名，防止伪造
4. ✅ **金额校验**: 支付前后端都要校验金额，防止篡改
5. ✅ **IP 白名单**: 配置服务器 IP 白名单
6. ✅ **日志脱敏**: 日志中不记录完整的密钥和敏感信息
7. ✅ **防重放**: 处理回调通知时防止重复处理

---

## 更多资源

- [微信开放平台文档](https://developers.weixin.qq.com/doc/)
- [微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [LyricNote 项目文档](./README.md)

---

如有问题，请联系开发团队或查看项目 Issues。
