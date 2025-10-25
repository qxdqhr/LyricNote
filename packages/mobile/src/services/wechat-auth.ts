/**
 * 移动端（React Native）微信登录服务
 * 使用 react-native-wechat-lib
 */

// 注意：需要先安装 react-native-wechat-lib
// npm install react-native-wechat-lib

// import * as WeChat from 'react-native-wechat-lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WechatLoginResult {
  success: boolean;
  userId?: string;
  token?: string;
  error?: string;
}

/**
 * 注册微信 APP
 * 需要在应用启动时调用
 */
export async function registerWechatApp(appId: string): Promise<void> {
  try {
    // const isInstalled = await WeChat.isWXAppInstalled();
    // if (!isInstalled) {
    //   throw new Error('未安装微信');
    // }

    // await WeChat.registerApp(appId, '');
    console.log('微信 APP 注册成功');
  } catch (error) {
    console.error('微信 APP 注册失败:', error);
    throw error;
  }
}

/**
 * 微信移动端登录
 */
export async function wechatLogin(): Promise<WechatLoginResult> {
  try {
    // 1. 调用微信登录
    // const result = await WeChat.sendAuthRequest('snsapi_userinfo', '');

    // 模拟结果（实际需要解除注释上面的代码）
    const result = {
      code: 'mock_code_' + Date.now(),
    };

    if (!result.code) {
      throw new Error('获取登录 code 失败');
    }

    console.log('微信登录成功，code:', result.code);

    // 2. 调用后端 API 完成登录
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const response = await fetch(`${API_URL}/api/auth/wechat/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: 'mobile',
        code: result.code,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || '登录失败');
    }

    console.log('后端登录成功:', data);

    // 3. 保存 token 到本地存储
    if (data.token) {
      await AsyncStorage.setItem('auth_token', data.token);
    }

    // 4. 保存用户信息
    if (data.userInfo) {
      await AsyncStorage.setItem('user_info', JSON.stringify(data.userInfo));
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
 * 检查登录状态
 */
export async function checkLoginStatus(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  } catch (error) {
    return false;
  }
}

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<any> {
  try {
    const userInfo = await AsyncStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(['auth_token', 'user_info']);
    console.log('退出登录成功');
  } catch (error) {
    console.error('退出登录失败:', error);
  }
}

/**
 * 检查是否安装微信
 */
export async function isWechatInstalled(): Promise<boolean> {
  try {
    // return await WeChat.isWXAppInstalled();
    return true; // 模拟
  } catch (error) {
    console.error('检查微信安装状态失败:', error);
    return false;
  }
}

