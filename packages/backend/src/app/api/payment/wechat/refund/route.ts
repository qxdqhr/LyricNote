/**
 * 申请退款 API
 * POST /api/payment/wechat/refund
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatPaymentService } from '@/lib/wechat/payment-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatPaymentRefundAPI');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, refundAmount, reason } = body;

    // 验证必需参数
    if (!orderId || !reason) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需参数：orderId 和 reason',
        },
        { status: 400 }
      );
    }

    // 验证退款金额（如果提供）
    if (refundAmount !== undefined && (!Number.isInteger(refundAmount) || refundAmount <= 0)) {
      return NextResponse.json(
        {
          success: false,
          error: '退款金额必须为正整数（单位：分）',
        },
        { status: 400 }
      );
    }

    logger.info('申请退款', { orderId, refundAmount, reason });

    // 调用支付服务处理退款
    const paymentService = new WechatPaymentService();
    const result = await paymentService.refund({
      orderId,
      refundAmount,
      reason,
    });

    if (!result.success) {
      logger.error('退款失败', result);
      return NextResponse.json(result, { status: 500 });
    }

    logger.info('退款成功', { orderId, refundId: result.refundId });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('退款异常', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '退款失败',
      },
      { status: 500 }
    );
  }
}
