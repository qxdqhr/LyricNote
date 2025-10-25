/**
 * 获取用户订单列表 API
 * GET /api/payment/wechat/orders
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatPaymentService } from '@/lib/wechat/payment-service';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatPaymentOrdersAPI');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');

    // 验证必需参数
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需参数：userId',
        },
        { status: 400 }
      );
    }

    logger.info('查询用户订单列表', { userId, status, page, pageSize });

    // 调用支付服务查询订单列表
    const paymentService = new WechatPaymentService();
    const result = await paymentService.getOrders({
      userId,
      status: status as any,
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });

    if (!result.success) {
      logger.error('查询订单列表失败', result);
      return NextResponse.json(result, { status: 500 });
    }

    logger.info('订单列表查询成功', {
      userId,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('查询订单列表异常', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '查询失败',
      },
      { status: 500 }
    );
  }
}

