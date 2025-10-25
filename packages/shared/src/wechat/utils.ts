/**
 * 微信登录和支付相关工具函数
 * 跨平台共享的工具方法
 */

import crypto from 'crypto';

// ============================================================================
// 签名和加密相关
// ============================================================================

/**
 * 验证微信签名
 * @param data 待验证的数据
 * @param signature 签名
 * @param key 密钥
 * @returns 是否验证通过
 */
export function verifyWechatSignature(
  data: Record<string, any>,
  signature: string,
  key: string
): boolean {
  const generated = generateWechatSignature(data, key);
  return generated === signature;
}

/**
 * 生成微信签名
 * @param data 待签名的数据
 * @param key 密钥
 * @returns 签名字符串
 */
export function generateWechatSignature(data: Record<string, any>, key: string): string {
  // 1. 过滤空值和sign字段
  const filteredData: Record<string, any> = {};
  Object.keys(data).forEach((k) => {
    if (data[k] !== '' && data[k] !== undefined && data[k] !== null && k !== 'sign') {
      filteredData[k] = data[k];
    }
  });

  // 2. 按键名ASCII码升序排列
  const sortedKeys = Object.keys(filteredData).sort();

  // 3. 拼接成字符串
  const stringA = sortedKeys.map((k) => `${k}=${filteredData[k]}`).join('&');

  // 4. 拼接密钥
  const stringSignTemp = `${stringA}&key=${key}`;

  // 5. MD5加密并转为大写
  const sign = crypto.createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase();

  return sign;
}

/**
 * 生成随机字符串
 * @param length 长度，默认32
 * @returns 随机字符串
 */
export function generateNonceStr(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================================================
// 订单号生成
// ============================================================================

/**
 * 生成订单号
 * 格式：平台前缀 + 时间戳 + 随机数
 * 示例：WX202501011234567890123456
 * @param prefix 前缀，默认WX
 * @returns 订单号
 */
export function generateOrderId(prefix: string = 'WX'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${prefix}${timestamp}${random}`;
}

// ============================================================================
// 金额转换
// ============================================================================

/**
 * 元转分（微信支付金额单位为分）
 * @param yuan 元
 * @returns 分
 */
export function yuan2fen(yuan: number): number {
  return Math.round(yuan * 100);
}

/**
 * 分转元
 * @param fen 分
 * @returns 元
 */
export function fen2yuan(fen: number): number {
  return fen / 100;
}

/**
 * 格式化金额显示
 * @param fen 分
 * @param withSymbol 是否显示货币符号
 * @returns 格式化后的字符串
 */
export function formatAmount(fen: number, withSymbol: boolean = true): string {
  const yuan = fen2yuan(fen);
  const formatted = yuan.toFixed(2);
  return withSymbol ? `¥${formatted}` : formatted;
}

// ============================================================================
// 时间戳转换
// ============================================================================

/**
 * 获取当前时间戳（秒）
 * @returns 时间戳（秒）
 */
export function getTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

/**
 * 微信时间格式转换
 * @param wechatTime 微信时间格式：20250101123456
 * @returns ISO时间字符串
 */
export function parseWechatTime(wechatTime: string): string {
  if (!wechatTime || wechatTime.length !== 14) {
    return '';
  }

  const year = wechatTime.substring(0, 4);
  const month = wechatTime.substring(4, 6);
  const day = wechatTime.substring(6, 8);
  const hour = wechatTime.substring(8, 10);
  const minute = wechatTime.substring(10, 12);
  const second = wechatTime.substring(12, 14);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

// ============================================================================
// XML转换（微信支付回调使用XML格式）
// ============================================================================

/**
 * 对象转XML
 * @param obj 对象
 * @returns XML字符串
 */
export function buildXML(obj: Record<string, any>): string {
  let xml = '<xml>';

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === null || value === undefined) {
      return;
    }

    // CDATA包裹字符串值
    if (typeof value === 'string') {
      xml += `<${key}><![CDATA[${value}]]></${key}>`;
    } else {
      xml += `<${key}>${value}</${key}>`;
    }
  });

  xml += '</xml>';
  return xml;
}

/**
 * XML转对象（简单实现）
 * @param xml XML字符串
 * @returns 对象
 */
export function parseXML(xml: string): Record<string, any> {
  const obj: Record<string, any> = {};

  // 移除xml标签
  xml = xml.replace(/<\?xml.*?\?>/g, '');
  xml = xml.replace(/<xml>|<\/xml>/g, '');

  // 提取标签内容
  const regex = /<(\w+)>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/\1>/g;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const key = match[1];
    const value = match[2];

    // 尝试转换为数字
    if (/^\d+$/.test(value)) {
      obj[key] = parseInt(value, 10);
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

// ============================================================================
// 数据验证
// ============================================================================

/**
 * 验证订单号格式
 * @param orderId 订单号
 * @returns 是否有效
 */
export function isValidOrderId(orderId: string): boolean {
  // 订单号格式：2-32位字母数字
  return /^[A-Za-z0-9]{2,32}$/.test(orderId);
}

/**
 * 验证金额（单位：分）
 * @param amount 金额
 * @returns 是否有效
 */
export function isValidAmount(amount: number): boolean {
  // 金额必须为正整数
  return Number.isInteger(amount) && amount > 0;
}

/**
 * 验证微信 openid 格式
 * @param openid openid
 * @returns 是否有效
 */
export function isValidOpenid(openid: string): boolean {
  // openid 格式：28位字母数字组合
  return /^[A-Za-z0-9_-]{28}$/.test(openid);
}

// ============================================================================
// 错误处理
// ============================================================================

/**
 * 微信错误码映射
 */
export const WECHAT_ERROR_MESSAGES: Record<string, string> = {
  NOAUTH: '商户无此接口权限',
  NOTENOUGH: '余额不足',
  ORDERPAID: '商户订单已支付',
  ORDERCLOSED: '订单已关闭',
  SYSTEMERROR: '系统错误',
  APPID_NOT_EXIST: 'APPID不存在',
  MCHID_NOT_EXIST: '商户号不存在',
  APPID_MCHID_NOT_MATCH: 'appid和mch_id不匹配',
  LACK_PARAMS: '缺少参数',
  OUT_TRADE_NO_USED: '商户订单号重复',
  SIGNERROR: '签名错误',
  XML_FORMAT_ERROR: 'XML格式错误',
  REQUIRE_POST_METHOD: '请使用POST方法',
  POST_DATA_EMPTY: 'POST数据为空',
  NOT_UTF8: '编码格式错误',
};

/**
 * 获取微信错误信息
 * @param errorCode 错误码
 * @returns 错误信息
 */
export function getWechatErrorMessage(errorCode: string): string {
  return WECHAT_ERROR_MESSAGES[errorCode] || `未知错误: ${errorCode}`;
}

// ============================================================================
// URL处理
// ============================================================================

/**
 * 构建带参数的URL
 * @param baseUrl 基础URL
 * @param params 参数对象
 * @returns 完整URL
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const query = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return query ? `${baseUrl}?${query}` : baseUrl;
}

/**
 * 解析URL参数
 * @param url URL字符串
 * @returns 参数对象
 */
export function parseUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const questionIndex = url.indexOf('?');

  if (questionIndex === -1) {
    return params;
  }

  const queryString = url.substring(questionIndex + 1);
  const pairs = queryString.split('&');

  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
}
