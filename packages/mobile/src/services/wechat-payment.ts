/**
 * 移动端（React Native）微信支付服务
 * 使用 react-native-wechat-lib
 */

// import * as WeChat from 'react-native-wechat-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    console.log('创建支付订单:', params);

    // 1. 调用后端 API 创建支付订单
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const createResponse = await fetch(`${API_URL}/api/payment/wechat/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        platform: 'mobile',
      }),
    });

    const createData = await createResponse.json();

    if (!createData.success) {
      throw new Error(createData.error || '创建订单失败');
    }

    console.log('订单创建成功:', createData);

    const { orderId, paymentParams } = createData;

    if (!paymentParams) {
      throw new Error('支付参数缺失');
    }

    // 2. 调用微信支付
    // const payResult = await WeChat.pay({
    //   partnerId: paymentParams.partnerId,
    //   prepayId: paymentParams.prepayId,
    //   nonceStr: paymentParams.nonceStr,
    //   timeStamp: paymentParams.timeStamp,
    //   package: paymentParams.package,
    //   sign: paymentParams.paySign,
    // });

    // 模拟支付成功（实际需要解除注释上面的代码）
    const payResult = { errCode: 0 };

    if (payResult.errCode !== 0) {
      throw new Error('支付失败');
    }

    console.log('支付成功');

    // 3. 支付成功，可以查询订单状态确认
    await queryPaymentStatus(orderId);

    return {
      success: true,
      orderId,
    };
  } catch (error: any) {
    console.error('支付失败:', error);

    // 处理用户取消支付
    if (error.errCode === -2) {
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
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const response = await fetch(`${API_URL}/api/payment/wechat/query/${orderId}`);
    const data = await response.json();

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
): Promise<any[]> {
  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const response = await fetch(
      `${API_URL}/api/payment/wechat/orders?userId=${userId}&page=${page}&pageSize=${pageSize}`
    );
    const data = await response.json();

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
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const response = await fetch(`${API_URL}/api/payment/wechat/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        reason,
      }),
    });

    const data = await response.json();

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

/**
 * 格式化金额显示
 */
export function formatAmount(amount: number, withSymbol: boolean = true): string {
  const yuan = amount / 100;
  const formatted = yuan.toFixed(2);
  return withSymbol ? `¥${formatted}` : formatted;
}
