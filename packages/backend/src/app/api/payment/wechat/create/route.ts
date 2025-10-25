/**
 * 创建微信支付订单 API
 * POST /api/payment/wechat/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatPaymentService } from '@/lib/wechat/payment-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatPaymentCreateAPI');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, platform, amount, productName, productId, description, openid } = body;

    // 验证必需参数
    if (!userId || !platform || !amount || !productName) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需参数',
        },
        { status: 400 }
      );
    }

    // 验证金额
    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: '金额必须为正整数（单位：分）',
        },
        { status: 400 }
      );
    }

    // 验证平台类型
    if (!['web', 'miniapp', 'mobile'].includes(platform)) {
      return NextResponse.json(
        {
          success: false,
          error: '不支持的支付平台',
        },
        { status: 400 }
      );
    }

    // 小程序支付需要 openid
    if (platform === 'miniapp' && !openid) {
      return NextResponse.json(
        {
          success: false,
          error: '小程序支付需要提供 openid',
        },
        { status: 400 }
      );
    }

    // 获取客户端 IP
    const clientIp =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      '127.0.0.1';

    // 获取回调 URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || request.nextUrl.origin;
    const notifyUrl = `${baseUrl}/api/payment/wechat/notify`;

    logger.info('创建支付订单请求', { userId, platform, amount, productName });

    // 调用支付服务
    const paymentService = new WechatPaymentService();
    const result = await paymentService.createOrder({
      userId,
      platform,
      amount,
      productName,
      productId,
      description,
      openid,
      clientIp,
      notifyUrl,
    });

    if (!result.success) {
      logger.error('创建支付订单失败', result);
      return NextResponse.json(result, { status: 500 });
    }

    logger.info('支付订单创建成功', { orderId: result.orderId });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('创建支付订单异常', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '创建订单失败',
      },
      { status: 500 }
    );
  }
}
