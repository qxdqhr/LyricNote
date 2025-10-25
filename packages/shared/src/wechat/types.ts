/**
 * 微信登录和支付相关类型定义
 * 跨平台共享的类型，用于 backend、miniapp、mobile
 */

// ============================================================================
// 平台类型
// ============================================================================

export type WechatPlatform = 'web' | 'miniapp' | 'mobile';

export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

export type TradeType = 'JSAPI' | 'NATIVE' | 'APP' | 'MWEB';

// ============================================================================
// 登录相关类型
// ============================================================================

/**
 * 微信登录参数
 */
export interface WechatLoginParams {
  /** 平台类型 */
  platform: WechatPlatform;
  /** 微信授权码（wx.login() 返回） */
  code: string;
  /** 网页登录状态参数（防CSRF攻击） */
  state?: string;
  /** 加密数据（小程序需要） */
  encryptedData?: string;
  /** 加密算法的初始向量（小程序需要） */
  iv?: string;
}

/**
 * 微信用户信息
 */
export interface WechatUserInfo {
  /** 平台唯一标识 */
  openid: string;
  /** 跨平台唯一标识 */
  unionid?: string;
  /** 昵称 */
  nickname: string;
  /** 头像 URL */
  avatar: string;
  /** 性别：0-未知，1-男，2-女 */
  gender?: number;
  /** 国家 */
  country?: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
}

/**
 * 微信登录响应
 */
export interface WechatLoginResponse {
  /** 登录成功标志 */
  success: boolean;
  /** 系统用户 ID */
  userId?: string;
  /** 认证 Token */
  token?: string;
  /** 刷新 Token */
  refreshToken?: string;
  /** 用户信息 */
  userInfo?: WechatUserInfo;
  /** 是否新用户 */
  isNewUser?: boolean;
  /** 错误信息 */
  error?: string;
}

/**
 * 微信绑定信息
 */
export interface WechatBinding {
  id: number;
  userId: string;
  platform: WechatPlatform;
  openid: string;
  unionid?: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 支付相关类型
// ============================================================================

/**
 * 创建支付订单参数
 */
export interface PaymentCreateParams {
  /** 用户 ID */
  userId: string;
  /** 支付平台 */
  platform: WechatPlatform;
  /** 支付金额（单位：分） */
  amount: number;
  /** 商品 ID */
  productId?: string;
  /** 商品名称 */
  productName: string;
  /** 商品描述 */
  description?: string;
  /** 客户端 IP */
  clientIp?: string;
  /** 支付回调 URL */
  notifyUrl: string;
  /** 小程序支付需要的 openid */
  openid?: string;
}

/**
 * 支付结果
 */
export interface PaymentResult {
  /** 是否成功 */
  success: boolean;
  /** 系统订单号 */
  orderId?: string;
  /** 预支付 ID（小程序/APP支付需要） */
  prepayId?: string;
  /** 支付二维码 URL（Native 扫码支付） */
  codeUrl?: string;
  /** 小程序/APP 支付参数 */
  paymentParams?: PaymentParams;
  /** H5 支付跳转 URL */
  mwebUrl?: string;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  errorCode?: string;
}

/**
 * 小程序/APP 支付参数
 */
export interface PaymentParams {
  /** 应用 ID */
  appId: string;
  /** 时间戳 */
  timeStamp: string;
  /** 随机字符串 */
  nonceStr: string;
  /** 订单详情扩展字符串 */
  package: string;
  /** 签名类型 */
  signType: string;
  /** 签名 */
  paySign: string;
  /** 预支付交易会话标识（APP支付） */
  prepayId?: string;
  /** 商户号（APP支付） */
  partnerId?: string;
}

/**
 * 支付订单信息
 */
export interface PaymentOrder {
  id: number;
  orderId: string;
  userId: string;
  platform: string;
  tradeType: TradeType;
  amount: number;
  currency: string;
  productId?: string;
  productName: string;
  description?: string;
  status: PaymentStatus;
  transactionId?: string;
  prepayId?: string;
  paymentTime?: string;
  callbackData?: any;
  notifyCount: number;
  clientIp?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 支付查询参数
 */
export interface PaymentQueryParams {
  /** 系统订单号 */
  orderId?: string;
  /** 微信支付订单号 */
  transactionId?: string;
}

/**
 * 支付查询结果
 */
export interface PaymentQueryResult {
  success: boolean;
  order?: PaymentOrder;
  error?: string;
}

/**
 * 退款参数
 */
export interface RefundParams {
  /** 系统订单号 */
  orderId: string;
  /** 退款金额（单位：分），不填则全额退款 */
  refundAmount?: number;
  /** 退款原因 */
  reason: string;
}

/**
 * 退款结果
 */
export interface RefundResult {
  success: boolean;
  /** 退款单号 */
  refundId?: string;
  /** 错误信息 */
  error?: string;
}

/**
 * 用户订单列表查询参数
 */
export interface OrderListParams {
  /** 用户 ID */
  userId: string;
  /** 订单状态筛选 */
  status?: PaymentStatus;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 订单列表响应
 */
export interface OrderListResponse {
  success: boolean;
  orders?: PaymentOrder[];
  total?: number;
  page?: number;
  pageSize?: number;
  error?: string;
}

// ============================================================================
// 微信支付回调相关类型
// ============================================================================

/**
 * 微信支付回调数据
 */
export interface WechatPaymentNotify {
  /** 返回状态码 */
  return_code: string;
  /** 返回信息 */
  return_msg?: string;
  /** 应用 ID */
  appid?: string;
  /** 商户号 */
  mch_id?: string;
  /** 设备号 */
  device_info?: string;
  /** 随机字符串 */
  nonce_str?: string;
  /** 签名 */
  sign?: string;
  /** 签名类型 */
  sign_type?: string;
  /** 业务结果 */
  result_code?: string;
  /** 错误代码 */
  err_code?: string;
  /** 错误代码描述 */
  err_code_des?: string;
  /** 用户标识 */
  openid?: string;
  /** 交易类型 */
  trade_type?: string;
  /** 付款银行 */
  bank_type?: string;
  /** 订单金额 */
  total_fee?: number;
  /** 货币类型 */
  fee_type?: string;
  /** 现金支付金额 */
  cash_fee?: number;
  /** 现金支付货币类型 */
  cash_fee_type?: string;
  /** 商户订单号 */
  out_trade_no?: string;
  /** 微信支付订单号 */
  transaction_id?: string;
  /** 商家数据包 */
  attach?: string;
  /** 支付完成时间 */
  time_end?: string;
}

/**
 * 支付回调响应（返回给微信）
 */
export interface WechatPaymentNotifyResponse {
  return_code: 'SUCCESS' | 'FAIL';
  return_msg?: string;
}

