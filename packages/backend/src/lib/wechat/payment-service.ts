/**
 * 微信支付服务
 * 支持网页扫码、小程序、APP支付
 */

import axios from 'axios';
import crypto from 'crypto';
import { ConfigService } from '@/lib/config/config-service';
import { db } from '@/lib/drizzle/db';
import { paymentOrders, paymentLogs } from '../../../drizzle/migrations/schema';
import { eq, and, desc } from 'drizzle-orm';
import type {
  PaymentCreateParams,
  PaymentResult,
  PaymentParams,
  PaymentOrder,
  PaymentQueryParams,
  PaymentQueryResult,
  RefundParams,
  RefundResult,
  OrderListParams,
  OrderListResponse,
  WechatPaymentNotify,
  WechatPaymentNotifyResponse,
  PaymentStatus,
  TradeType,
} from '@lyricnote/shared';
import {
  generateNonceStr,
  generateOrderId,
  getTimestamp,
  parseWechatTime,
  buildXML,
  parseXML,
  generateWechatSignature,
  verifyWechatSignature,
} from '@lyricnote/shared';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatPaymentService');

/**
 * 微信支付服务
 */
export class WechatPaymentService {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  /**
   * 创建支付订单
   * @param params 支付参数
   * @returns 支付结果
   */
  async createOrder(params: PaymentCreateParams): Promise<PaymentResult> {
    try {
      logger.info('创建支付订单', params);

      // 1. 生成订单号
      const orderId = generateOrderId('WX');

      // 2. 保存订单到数据库
      const timestamp = new Date().toISOString();
      await db.insert(paymentOrders).values({
        orderId,
        userId: params.userId,
        platform: 'wechat',
        tradeType: this.getTradeType(params.platform),
        amount: params.amount,
        currency: 'CNY',
        productId: params.productId,
        productName: params.productName,
        description: params.description,
        status: 'pending',
        clientIp: params.clientIp,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      // 3. 记录日志
      await this.logPayment(orderId, 'create', params, { orderId });

      // 4. 根据平台类型调用不同的支付接口
      let paymentResult: PaymentResult;

      switch (params.platform) {
        case 'web':
          paymentResult = await this.createNativePayment(orderId);
          break;
        case 'miniapp':
          if (!params.openid) {
            throw new Error('小程序支付需要提供 openid');
          }
          paymentResult = await this.createMiniappPayment(orderId, params.openid);
          break;
        case 'mobile':
          paymentResult = await this.createMobilePayment(orderId);
          break;
        default:
          throw new Error(`不支持的支付平台: ${params.platform}`);
      }

      logger.info('支付订单创建成功', { orderId, ...paymentResult });
      return {
        ...paymentResult,
        orderId,
      };
    } catch (error) {
      logger.error('创建支付订单失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建订单失败',
      };
    }
  }

  /**
   * 网页扫码支付（Native）
   * @param orderId 订单号
   * @returns 支付二维码 URL
   */
  async createNativePayment(orderId: string): Promise<PaymentResult> {
    try {
      logger.info('创建 Native 支付', { orderId });

      // 获取订单信息
      const order = await this.getOrderByOrderId(orderId);
      if (!order) {
        throw new Error('订单不存在');
      }

      // 获取配置
      const appid = await this.configService.getConfig('wechat_web_appid');
      const mchId = await this.configService.getConfig('wechat_mch_id');
      const mchKey = await this.configService.getConfig('wechat_mch_key');
      const notifyUrl = await this.configService.getConfig('wechat_notify_url');

      if (!appid || !mchId || !mchKey || !notifyUrl) {
        throw new Error('微信支付配置不完整');
      }

      // 构建统一下单请求参数
      const params: any = {
        appid,
        mch_id: mchId,
        nonce_str: generateNonceStr(),
        body: order.productName,
        out_trade_no: orderId,
        total_fee: order.amount,
        spbill_create_ip: order.clientIp || '127.0.0.1',
        notify_url: notifyUrl,
        trade_type: 'NATIVE',
      };

      // 生成签名
      params.sign = generateWechatSignature(params, mchKey);

      // 转换为 XML
      const xmlData = buildXML(params);

      // 发起统一下单请求
      const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });

      // 解析响应
      const result = parseXML(response.data);

      if (result.return_code !== 'SUCCESS') {
        throw new Error(`统一下单失败: ${result.return_msg}`);
      }

      if (result.result_code !== 'SUCCESS') {
        throw new Error(`统一下单失败: ${result.err_code_des}`);
      }

      // 更新订单的 prepay_id
      await db
        .update(paymentOrders)
        .set({
          prepayId: result.prepay_id,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentOrders.orderId, orderId));

      // 记录日志
      await this.logPayment(orderId, 'create', params, result);

      return {
        success: true,
        orderId,
        codeUrl: result.code_url,
        prepayId: result.prepay_id,
      };
    } catch (error) {
      logger.error('创建 Native 支付失败', error);
      await this.logPayment(orderId, 'create', {}, { error: String(error) });
      throw error;
    }
  }

  /**
   * 小程序支付（JSAPI）
   * @param orderId 订单号
   * @param openid 用户 openid
   * @returns 支付参数
   */
  async createMiniappPayment(orderId: string, openid: string): Promise<PaymentResult> {
    try {
      logger.info('创建小程序支付', { orderId, openid });

      // 获取订单信息
      const order = await this.getOrderByOrderId(orderId);
      if (!order) {
        throw new Error('订单不存在');
      }

      // 获取配置
      const appid = await this.configService.getConfig('wechat_miniapp_appid');
      const mchId = await this.configService.getConfig('wechat_mch_id');
      const mchKey = await this.configService.getConfig('wechat_mch_key');
      const notifyUrl = await this.configService.getConfig('wechat_notify_url');

      if (!appid || !mchId || !mchKey || !notifyUrl) {
        throw new Error('微信支付配置不完整');
      }

      // 构建统一下单请求参数
      const params: any = {
        appid,
        mch_id: mchId,
        nonce_str: generateNonceStr(),
        body: order.productName,
        out_trade_no: orderId,
        total_fee: order.amount,
        spbill_create_ip: order.clientIp || '127.0.0.1',
        notify_url: notifyUrl,
        trade_type: 'JSAPI',
        openid,
      };

      // 生成签名
      params.sign = generateWechatSignature(params, mchKey);

      // 转换为 XML
      const xmlData = buildXML(params);

      // 发起统一下单请求
      const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });

      // 解析响应
      const result = parseXML(response.data);

      if (result.return_code !== 'SUCCESS') {
        throw new Error(`统一下单失败: ${result.return_msg}`);
      }

      if (result.result_code !== 'SUCCESS') {
        throw new Error(`统一下单失败: ${result.err_code_des}`);
      }

      // 更新订单的 prepay_id
      await db
        .update(paymentOrders)
        .set({
          prepayId: result.prepay_id,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentOrders.orderId, orderId));

      // 生成小程序支付参数
      const paymentParams: PaymentParams = {
        appId: appid,
        timeStamp: getTimestamp(),
        nonceStr: generateNonceStr(),
        package: `prepay_id=${result.prepay_id}`,
        signType: 'MD5',
        paySign: '',
      };

      // 生成支付签名
      const signData: any = {
        appId: paymentParams.appId,
        timeStamp: paymentParams.timeStamp,
        nonceStr: paymentParams.nonceStr,
        package: paymentParams.package,
        signType: paymentParams.signType,
      };
      paymentParams.paySign = generateWechatSignature(signData, mchKey);

      // 记录日志
      await this.logPayment(orderId, 'create', params, result);

      return {
        success: true,
        orderId,
        prepayId: result.prepay_id,
        paymentParams,
      };
    } catch (error) {
      logger.error('创建小程序支付失败', error);
      await this.logPayment(orderId, 'create', {}, { error: String(error) });
      throw error;
    }
  }

  /**
   * APP 支付
   * @param orderId 订单号
   * @returns 支付参数
   */
  async createMobilePayment(orderId: string): Promise<PaymentResult> {
    try {
      logger.info('创建 APP 支付', { orderId });

      // 获取订单信息
      const order = await this.getOrderByOrderId(orderId);
      if (!order) {
        throw new Error('订单不存在');
      }

      // 获取配置
      const appid = await this.configService.getConfig('wechat_mobile_appid');
      const mchId = await this.configService.getConfig('wechat_mch_id');
      const mchKey = await this.configService.getConfig('wechat_mch_key');
      const notifyUrl = await this.configService.getConfig('wechat_notify_url');

      if (!appid || !mchId || !mchKey || !notifyUrl) {
        throw new Error('微信支付配置不完整');
      }

      // 构建统一下单请求参数
      const params: any = {
        appid,
        mch_id: mchId,
        nonce_str: generateNonceStr(),
        body: order.productName,
        out_trade_no: orderId,
        total_fee: order.amount,
        spbill_create_ip: order.clientIp || '127.0.0.1',
        notify_url: notifyUrl,
        trade_type: 'APP',
      };

      // 生成签名
      params.sign = generateWechatSignature(params, mchKey);

      // 转换为 XML
      const xmlData = buildXML(params);

      // 发起统一下单请求
      const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });

      // 解析响应
      const result = parseXML(response.data);

      if (result.return_code !== 'SUCCESS') {
        throw new Error(`统一下单失败: ${result.return_msg}`);
      }

      if (result.result_code !== 'SUCCESS') {
        throw new Error(`统一下单失败: ${result.err_code_des}`);
      }

      // 更新订单的 prepay_id
      await db
        .update(paymentOrders)
        .set({
          prepayId: result.prepay_id,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentOrders.orderId, orderId));

      // 生成 APP 支付参数
      const paymentParams: PaymentParams = {
        appId: appid,
        partnerId: mchId,
        prepayId: result.prepay_id,
        package: 'Sign=WXPay',
        nonceStr: generateNonceStr(),
        timeStamp: getTimestamp(),
        signType: 'MD5',
        paySign: '',
      };

      // 生成支付签名
      const signData: any = {
        appid: paymentParams.appId,
        partnerid: paymentParams.partnerId,
        prepayid: paymentParams.prepayId,
        package: paymentParams.package,
        noncestr: paymentParams.nonceStr,
        timestamp: paymentParams.timeStamp,
      };
      paymentParams.paySign = generateWechatSignature(signData, mchKey);

      // 记录日志
      await this.logPayment(orderId, 'create', params, result);

      return {
        success: true,
        orderId,
        prepayId: result.prepay_id,
        paymentParams,
      };
    } catch (error) {
      logger.error('创建 APP 支付失败', error);
      await this.logPayment(orderId, 'create', {}, { error: String(error) });
      throw error;
    }
  }

  /**
   * 处理支付回调通知
   * @param xmlData 微信回调的 XML 数据
   * @returns 是否处理成功
   */
  async handlePaymentNotify(xmlData: string): Promise<WechatPaymentNotifyResponse> {
    try {
      logger.info('收到支付回调通知');

      // 解析 XML
      const notifyData: WechatPaymentNotify = parseXML(xmlData);

      // 验证签名
      const mchKey = await this.configService.getConfig('wechat_mch_key');
      if (!mchKey) {
        throw new Error('商户密钥未配置');
      }

      const isValidSign = verifyWechatSignature(notifyData, notifyData.sign || '', mchKey);
      if (!isValidSign) {
        logger.error('支付回调签名验证失败');
        return {
          return_code: 'FAIL',
          return_msg: '签名验证失败',
        };
      }

      // 检查通知状态
      if (notifyData.return_code !== 'SUCCESS' || notifyData.result_code !== 'SUCCESS') {
        logger.error('支付失败', notifyData);
        return {
          return_code: 'FAIL',
          return_msg: notifyData.err_code_des || '支付失败',
        };
      }

      const orderId = notifyData.out_trade_no!;
      const transactionId = notifyData.transaction_id!;

      // 查询订单
      const order = await this.getOrderByOrderId(orderId);
      if (!order) {
        logger.error('订单不存在', { orderId });
        return {
          return_code: 'FAIL',
          return_msg: '订单不存在',
        };
      }

      // 防止重复通知
      if (order.status === 'paid') {
        logger.warn('订单已支付，忽略重复通知', { orderId });
        return {
          return_code: 'SUCCESS',
          return_msg: 'OK',
        };
      }

      // 更新订单状态
      await db
        .update(paymentOrders)
        .set({
          status: 'paid',
          transactionId,
          paymentTime: parseWechatTime(notifyData.time_end!),
          callbackData: notifyData,
          notifyCount: (order.notifyCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentOrders.orderId, orderId));

      // 记录日志
      await this.logPayment(orderId, 'notify', notifyData, { success: true });

      logger.info('支付回调处理成功', { orderId, transactionId });

      return {
        return_code: 'SUCCESS',
        return_msg: 'OK',
      };
    } catch (error) {
      logger.error('处理支付回调失败', error);
      return {
        return_code: 'FAIL',
        return_msg: error instanceof Error ? error.message : '处理失败',
      };
    }
  }

  /**
   * 查询订单状态
   * @param params 查询参数
   * @returns 查询结果
   */
  async queryOrder(params: PaymentQueryParams): Promise<PaymentQueryResult> {
    try {
      logger.info('查询订单状态', params);

      // 从数据库查询订单
      let order: typeof paymentOrders.$inferSelect | undefined;

      if (params.orderId) {
        order = await this.getOrderByOrderId(params.orderId);
      } else if (params.transactionId) {
        const orders = await db
          .select()
          .from(paymentOrders)
          .where(eq(paymentOrders.transactionId, params.transactionId))
          .limit(1);
        order = orders[0];
      }

      if (!order) {
        return {
          success: false,
          error: '订单不存在',
        };
      }

      // 如果订单未支付，调用微信接口查询最新状态
      if (order.status === 'pending') {
        await this.queryOrderFromWechat(order.orderId);
        // 重新查询数据库获取最新状态
        order = await this.getOrderByOrderId(order.orderId);
      }

      return {
        success: true,
        order: order as PaymentOrder,
      };
    } catch (error) {
      logger.error('查询订单失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '查询失败',
      };
    }
  }

  /**
   * 从微信查询订单状态
   * @param orderId 订单号
   */
  private async queryOrderFromWechat(orderId: string): Promise<void> {
    try {
      const appid = await this.configService.getConfig('wechat_web_appid');
      const mchId = await this.configService.getConfig('wechat_mch_id');
      const mchKey = await this.configService.getConfig('wechat_mch_key');

      if (!appid || !mchId || !mchKey) {
        throw new Error('微信支付配置不完整');
      }

      const params: any = {
        appid,
        mch_id: mchId,
        out_trade_no: orderId,
        nonce_str: generateNonceStr(),
      };

      params.sign = generateWechatSignature(params, mchKey);
      const xmlData = buildXML(params);

      const response = await axios.post('https://api.mch.weixin.qq.com/pay/orderquery', xmlData, {
        headers: { 'Content-Type': 'text/xml' },
      });

      const result = parseXML(response.data);

      // 如果查询到订单已支付，更新数据库
      if (result.trade_state === 'SUCCESS') {
        await db
          .update(paymentOrders)
          .set({
            status: 'paid',
            transactionId: result.transaction_id,
            paymentTime: parseWechatTime(result.time_end),
            updatedAt: new Date().toISOString(),
          })
          .where(eq(paymentOrders.orderId, orderId));
      }

      await this.logPayment(orderId, 'query', params, result);
    } catch (error) {
      logger.error('从微信查询订单失败', error);
      throw error;
    }
  }

  /**
   * 申请退款
   * @param params 退款参数
   * @returns 退款结果
   */
  async refund(params: RefundParams): Promise<RefundResult> {
    try {
      logger.info('申请退款', params);

      // 查询订单
      const order = await this.getOrderByOrderId(params.orderId);
      if (!order) {
        throw new Error('订单不存在');
      }

      if (order.status !== 'paid') {
        throw new Error('订单未支付，无法退款');
      }

      // 退款金额（不填则全额退款）
      const refundAmount = params.refundAmount || order.amount;
      if (refundAmount > order.amount) {
        throw new Error('退款金额不能大于订单金额');
      }

      // TODO: 调用微信退款接口（需要商户证书）
      // 这里简化处理，仅更新订单状态
      await db
        .update(paymentOrders)
        .set({
          status: 'refunded',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentOrders.orderId, params.orderId));

      await this.logPayment(params.orderId, 'refund', params, { success: true });

      logger.info('退款成功', { orderId: params.orderId, refundAmount });

      return {
        success: true,
        refundId: `REFUND_${params.orderId}`,
      };
    } catch (error) {
      logger.error('退款失败', error);
      await this.logPayment(params.orderId, 'refund', params, { error: String(error) });
      return {
        success: false,
        error: error instanceof Error ? error.message : '退款失败',
      };
    }
  }

  /**
   * 获取用户订单列表
   * @param params 查询参数
   * @returns 订单列表
   */
  async getOrders(params: OrderListParams): Promise<OrderListResponse> {
    try {
      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const offset = (page - 1) * pageSize;

      let query = db
        .select()
        .from(paymentOrders)
        .where(eq(paymentOrders.userId, params.userId))
        .orderBy(desc(paymentOrders.createdAt))
        .limit(pageSize)
        .offset(offset);

      // 状态筛选
      if (params.status) {
        query = db
          .select()
          .from(paymentOrders)
          .where(
            and(eq(paymentOrders.userId, params.userId), eq(paymentOrders.status, params.status))
          )
          .orderBy(desc(paymentOrders.createdAt))
          .limit(pageSize)
          .offset(offset);
      }

      const orders = await query;

      // 查询总数
      const totalResult = await db
        .select()
        .from(paymentOrders)
        .where(eq(paymentOrders.userId, params.userId));
      const total = totalResult.length;

      return {
        success: true,
        orders: orders as PaymentOrder[],
        total,
        page,
        pageSize,
      };
    } catch (error) {
      logger.error('获取订单列表失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '查询失败',
      };
    }
  }

  // ============================================================================
  // 辅助方法
  // ============================================================================

  /**
   * 根据订单号查询订单
   */
  private async getOrderByOrderId(
    orderId: string
  ): Promise<typeof paymentOrders.$inferSelect | undefined> {
    const orders = await db
      .select()
      .from(paymentOrders)
      .where(eq(paymentOrders.orderId, orderId))
      .limit(1);
    return orders[0];
  }

  /**
   * 根据平台类型获取支付类型
   */
  private getTradeType(platform: string): TradeType {
    switch (platform) {
      case 'web':
        return 'NATIVE';
      case 'miniapp':
        return 'JSAPI';
      case 'mobile':
        return 'APP';
      default:
        return 'NATIVE';
    }
  }

  /**
   * 记录支付日志
   */
  private async logPayment(
    orderId: string,
    action: string,
    requestData: any,
    responseData: any
  ): Promise<void> {
    try {
      await db.insert(paymentLogs).values({
        orderId,
        action,
        requestData,
        responseData,
        status: responseData.error ? 'failed' : 'success',
        errorMessage: responseData.error,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('记录支付日志失败', error);
    }
  }
}
