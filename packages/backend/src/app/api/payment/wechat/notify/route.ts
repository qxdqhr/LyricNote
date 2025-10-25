/**
 * 微信支付回调通知 API
 * POST /api/payment/wechat/notify
 *
 * 注意：此接口由微信服务器调用，需确保：
 * 1. 使用 HTTPS
 * 2. 正确验证签名
 * 3. 处理重复通知
 * 4. 返回正确的 XML 响应
 */

import { NextRequest, NextResponse } from 'next/server';
import { WechatPaymentService } from '@/lib/wechat/payment-service';
import { buildXML } from '@lyricnote/shared';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatPaymentNotifyAPI');

export async function POST(request: NextRequest) {
  try {
    // 读取原始 XML 数据
    const xmlData = await request.text();

    logger.info('收到微信支付回调通知');

    // 调用支付服务处理回调
    const paymentService = new WechatPaymentService();
    const result = await paymentService.handlePaymentNotify(xmlData);

    logger.info('支付回调处理完成', result);

    // 返回 XML 响应给微信
    const responseXml = buildXML(result);

    return new NextResponse(responseXml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    logger.error('处理支付回调异常', error);

    // 即使出错也要返回正确格式的 XML
    const errorResponse = buildXML({
      return_code: 'FAIL',
      return_msg: '处理失败',
    });

    return new NextResponse(errorResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

