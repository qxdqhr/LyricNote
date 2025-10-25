/**
 * 查询订单状态 API
 * GET /api/payment/wechat/query/:orderId
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatPaymentService } from '@/lib/wechat/payment-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatPaymentQueryAPI');

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少订单号',
        },
        { status: 400 }
      );
    }

    logger.info('查询订单状态', { orderId });

    // 调用支付服务查询订单
    const paymentService = new WechatPaymentService();
    const result = await paymentService.queryOrder({ orderId });

    if (!result.success) {
      logger.error('查询订单失败', result);
      return NextResponse.json(result, { status: 404 });
    }

    logger.info('订单查询成功', { orderId, status: result.order?.status });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('查询订单异常', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '查询失败',
      },
      { status: 500 }
    );
  }
}
