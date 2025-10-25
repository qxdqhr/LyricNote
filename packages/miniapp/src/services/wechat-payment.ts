/**
 * 小程序端微信支付服务
 */

import Taro from '@tarojs/taro';

interface PaymentParams {
  userId: string;
  amount: number;
  productName: string;
  productId?: string;
  description?: string;
}

interface PaymentResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

/**
 * 发起微信支付
 */
export async function wechatPay(params: PaymentParams): Promise<PaymentResult> {
  try {
    // 1. 获取用户 openid
    const userInfo = Taro.getStorageSync('user_info');
    if (!userInfo || !userInfo.openid) {
      throw new Error('请先登录');
    }

    const openid = userInfo.openid;

    console.log('创建支付订单:', params);

    // 2. 调用后端 API 创建支付订单
    const createRes = await Taro.request({
      url: `${process.env.TARO_APP_API_URL}/api/payment/wechat/create`,
      method: 'POST',
      data: {
        ...params,
        platform: 'miniapp',
        openid,
      },
    });

    const createData = createRes.data as any;

    if (!createData.success) {
      throw new Error(createData.error || '创建订单失败');
    }

    console.log('订单创建成功:', createData);

    const { orderId, paymentParams } = createData;

    if (!paymentParams) {
      throw new Error('支付参数缺失');
    }

    // 3. 调用微信支付
    await Taro.requestPayment({
      timeStamp: paymentParams.timeStamp,
      nonceStr: paymentParams.nonceStr,
      package: paymentParams.package,
      signType: paymentParams.signType as any,
      paySign: paymentParams.paySign,
    });

    console.log('支付成功');

    // 4. 支付成功，可以查询订单状态确认
    await queryPaymentStatus(orderId);

    return {
      success: true,
      orderId,
    };
  } catch (error: any) {
    console.error('支付失败:', error);

    // 处理用户取消支付
    if (error.errMsg && error.errMsg.includes('cancel')) {
      return {
        success: false,
        error: '用户取消支付',
      };
    }

    return {
      success: false,
      error: error.message || '支付失败',
    };
  }
}

/**
 * 查询支付状态
 */
export async function queryPaymentStatus(orderId: string): Promise<any> {
  try {
    const response = await Taro.request({
      url: `${process.env.TARO_APP_API_URL}/api/payment/wechat/query/${orderId}`,
      method: 'GET',
    });

    const data = response.data as any;

    if (data.success && data.order) {
      console.log('订单状态:', data.order.status);
      return data.order;
    }

    return null;
  } catch (error) {
    console.error('查询支付状态失败:', error);
    return null;
  }
}

/**
 * 获取用户订单列表
 */
export async function getUserOrders(
  userId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<any> {
  try {
    const response = await Taro.request({
      url: `${process.env.TARO_APP_API_URL}/api/payment/wechat/orders`,
      method: 'GET',
      data: {
        userId,
        page,
        pageSize,
      },
    });

    const data = response.data as any;

    if (data.success) {
      return data.orders || [];
    }

    return [];
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return [];
  }
}

/**
 * 申请退款
 */
export async function requestRefund(orderId: string, reason: string): Promise<boolean> {
  try {
    const response = await Taro.request({
      url: `${process.env.TARO_APP_API_URL}/api/payment/wechat/refund`,
      method: 'POST',
      data: {
        orderId,
        reason,
      },
    });

    const data = response.data as any;

    if (data.success) {
      console.log('退款申请成功');
      return true;
    }

    console.error('退款申请失败:', data.error);
    return false;
  } catch (error) {
    console.error('退款申请异常:', error);
    return false;
  }
}
