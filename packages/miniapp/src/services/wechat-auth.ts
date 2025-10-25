/**
 * 小程序端微信登录服务
 */

import Taro from '@tarojs/taro';

interface WechatLoginResult {
  success: boolean;
  userId?: string;
  token?: string;
  error?: string;
}

/**
 * 微信小程序登录
 */
export async function wechatLogin(): Promise<WechatLoginResult> {
  try {
    // 1. 调用微信登录获取 code
    const loginRes = await Taro.login();

    if (!loginRes.code) {
      throw new Error('获取登录 code 失败');
    }

    console.log('微信登录成功，code:', loginRes.code);

    // 2. 调用后端 API 完成登录
    const response = await Taro.request({
      url: `${process.env.TARO_APP_API_URL}/api/auth/wechat/login`,
      method: 'POST',
      data: {
        platform: 'miniapp',
        code: loginRes.code,
      },
    });

    const data = response.data as any;

    if (!data.success) {
      throw new Error(data.error || '登录失败');
    }

    console.log('后端登录成功:', data);

    // 3. 保存 token 到本地存储
    if (data.token) {
      await Taro.setStorageSync('auth_token', data.token);
    }

    // 4. 保存用户信息
    if (data.userInfo) {
      await Taro.setStorageSync('user_info', data.userInfo);
    }

    return {
      success: true,
      userId: data.userId,
      token: data.token,
    };
  } catch (error) {
    console.error('微信登录失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '登录失败',
    };
  }
}

/**
 * 获取用户信息（需要用户授权）
 * 注意：小程序需要通过按钮点击触发授权
 */
export async function getUserProfile(): Promise<any> {
  try {
    const res = await Taro.getUserProfile({
      desc: '用于完善用户资料',
    });

    console.log('获取用户信息成功:', res.userInfo);

    // 保存到本地
    await Taro.setStorageSync('user_profile', res.userInfo);

    return res.userInfo;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
}

/**
 * 检查登录状态
 */
export function checkLoginStatus(): boolean {
  try {
    const token = Taro.getStorageSync('auth_token');
    return !!token;
  } catch (error) {
    return false;
  }
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  try {
    await Taro.removeStorageSync('auth_token');
    await Taro.removeStorageSync('user_info');
    await Taro.removeStorageSync('user_profile');
    console.log('退出登录成功');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
}

