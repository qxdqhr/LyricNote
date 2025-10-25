/**
 * 微信登录服务
 * 处理网页、小程序、移动端的微信登录
 */

import axios from 'axios';
import { ConfigService } from '@/lib/config/config-service';
import { db } from '@/lib/drizzle/db';
import { user, userWechatBindings } from '../../../drizzle/migrations/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import type {
  WechatLoginParams,
  WechatUserInfo,
  WechatLoginResponse,
  WechatBinding,
  WechatPlatform,
} from '@lyricnote/shared';
import { logger as baseLogger } from '@/lib/logger';

const logger = baseLogger.createChild('WechatAuthService');

/**
 * 微信登录服务
 */
export class WechatAuthService {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  /**
   * 获取网页授权 URL
   * @param redirectUri 授权后重定向的回调地址
   * @param state 用于保持请求和回调的状态，授权请求后原样带回给第三方
   * @returns 授权 URL
   */
  async getWebAuthUrl(redirectUri: string, state: string = ''): Promise<string> {
    const appid = await this.configService.getConfig('wechat_web_appid');

    if (!appid) {
      throw new Error('微信网页应用 AppID 未配置');
    }

    const params = {
      appid,
      redirect_uri: encodeURIComponent(redirectUri),
      response_type: 'code',
      scope: 'snsapi_login', // 网页应用使用 snsapi_login
      state: state || this.generateState(),
    };

    const url = `https://open.weixin.qq.com/connect/qrconnect?${new URLSearchParams(params).toString()}#wechat_redirect`;

    logger.info('生成网页授权 URL', { redirectUri, state });
    return url;
  }

  /**
   * 网页登录：使用授权码换取 access_token
   * @param code 微信授权码
   * @returns 用户信息
   */
  async webLogin(code: string): Promise<WechatUserInfo> {
    logger.info('开始网页登录', { code });

    const appid = await this.configService.getConfig('wechat_web_appid');
    const secret = await this.configService.getConfig('wechat_web_appsecret');

    if (!appid || !secret) {
      throw new Error('微信网页应用配置不完整');
    }

    try {
      // 1. 通过 code 获取 access_token
      const tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token';
      const tokenParams = {
        appid,
        secret,
        code,
        grant_type: 'authorization_code',
      };

      const tokenResponse = await axios.get(tokenUrl, { params: tokenParams });
      const tokenData = tokenResponse.data;

      if (tokenData.errcode) {
        logger.error('获取 access_token 失败', tokenData);
        throw new Error(`微信登录失败: ${tokenData.errmsg}`);
      }

      const { access_token, openid, unionid, refresh_token, expires_in } = tokenData;

      // 2. 使用 access_token 获取用户信息
      const userInfoUrl = 'https://api.weixin.qq.com/sns/userinfo';
      const userInfoParams = {
        access_token,
        openid,
        lang: 'zh_CN',
      };

      const userInfoResponse = await axios.get(userInfoUrl, { params: userInfoParams });
      const userInfoData = userInfoResponse.data;

      if (userInfoData.errcode) {
        logger.error('获取用户信息失败', userInfoData);
        throw new Error(`获取用户信息失败: ${userInfoData.errmsg}`);
      }

      const wechatUserInfo: WechatUserInfo = {
        openid: userInfoData.openid,
        unionid: userInfoData.unionid,
        nickname: userInfoData.nickname,
        avatar: userInfoData.headimgurl,
        gender: userInfoData.sex,
        country: userInfoData.country,
        province: userInfoData.province,
        city: userInfoData.city,
      };

      logger.info('网页登录成功', { openid, unionid });
      return wechatUserInfo;
    } catch (error) {
      logger.error('网页登录异常', error);
      throw error;
    }
  }

  /**
   * 小程序登录：使用授权码换取 session_key 和 openid
   * @param code 小程序授权码
   * @returns 用户信息
   */
  async miniappLogin(code: string): Promise<WechatUserInfo> {
    logger.info('开始小程序登录', { code });

    const appid = await this.configService.getConfig('wechat_miniapp_appid');
    const secret = await this.configService.getConfig('wechat_miniapp_appsecret');

    if (!appid || !secret) {
      throw new Error('微信小程序配置不完整');
    }

    try {
      const url = 'https://api.weixin.qq.com/sns/jscode2session';
      const params = {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      };

      const response = await axios.get(url, { params });
      const data = response.data;

      if (data.errcode) {
        logger.error('小程序登录失败', data);
        throw new Error(`小程序登录失败: ${data.errmsg}`);
      }

      const { openid, unionid, session_key } = data;

      // 注意：小程序登录后只能获取 openid，昵称和头像需要用户授权后才能获取
      // 这里返回基本信息，昵称和头像由前端在用户授权后通过接口更新
      const wechatUserInfo: WechatUserInfo = {
        openid,
        unionid,
        nickname: '', // 需要用户授权后获取
        avatar: '', // 需要用户授权后获取
      };

      logger.info('小程序登录成功', { openid, unionid });
      return wechatUserInfo;
    } catch (error) {
      logger.error('小程序登录异常', error);
      throw error;
    }
  }

  /**
   * 移动应用登录：使用授权码换取 access_token
   * @param code 移动应用授权码
   * @returns 用户信息
   */
  async mobileLogin(code: string): Promise<WechatUserInfo> {
    logger.info('开始移动应用登录', { code });

    const appid = await this.configService.getConfig('wechat_mobile_appid');
    const secret = await this.configService.getConfig('wechat_mobile_appsecret');

    if (!appid || !secret) {
      throw new Error('微信移动应用配置不完整');
    }

    try {
      // APP 登录流程与网页登录类似
      const tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token';
      const tokenParams = {
        appid,
        secret,
        code,
        grant_type: 'authorization_code',
      };

      const tokenResponse = await axios.get(tokenUrl, { params: tokenParams });
      const tokenData = tokenResponse.data;

      if (tokenData.errcode) {
        logger.error('获取 access_token 失败', tokenData);
        throw new Error(`移动应用登录失败: ${tokenData.errmsg}`);
      }

      const { access_token, openid, unionid } = tokenData;

      // 获取用户信息
      const userInfoUrl = 'https://api.weixin.qq.com/sns/userinfo';
      const userInfoParams = {
        access_token,
        openid,
        lang: 'zh_CN',
      };

      const userInfoResponse = await axios.get(userInfoUrl, { params: userInfoParams });
      const userInfoData = userInfoResponse.data;

      if (userInfoData.errcode) {
        logger.error('获取用户信息失败', userInfoData);
        throw new Error(`获取用户信息失败: ${userInfoData.errmsg}`);
      }

      const wechatUserInfo: WechatUserInfo = {
        openid: userInfoData.openid,
        unionid: userInfoData.unionid,
        nickname: userInfoData.nickname,
        avatar: userInfoData.headimgurl,
        gender: userInfoData.sex,
        country: userInfoData.country,
        province: userInfoData.province,
        city: userInfoData.city,
      };

      logger.info('移动应用登录成功', { openid, unionid });
      return wechatUserInfo;
    } catch (error) {
      logger.error('移动应用登录异常', error);
      throw error;
    }
  }

  /**
   * 统一登录接口
   * @param params 登录参数
   * @returns 登录响应
   */
  async login(params: WechatLoginParams): Promise<WechatLoginResponse> {
    try {
      logger.info('开始微信登录', params);

      // 根据平台调用不同的登录方法
      let wechatUserInfo: WechatUserInfo;

      switch (params.platform) {
        case 'web':
          wechatUserInfo = await this.webLogin(params.code);
          break;
        case 'miniapp':
          wechatUserInfo = await this.miniappLogin(params.code);
          break;
        case 'mobile':
          wechatUserInfo = await this.mobileLogin(params.code);
          break;
        default:
          throw new Error(`不支持的平台: ${params.platform}`);
      }

      // 绑定或创建用户
      const systemUser = await this.bindOrCreateUser(params.platform, wechatUserInfo);

      // 生成认证 token（这里简化处理，实际应该生成 JWT）
      const token = this.generateToken(systemUser.id);

      logger.info('微信登录完成', { userId: systemUser.id, platform: params.platform });

      return {
        success: true,
        userId: systemUser.id,
        token,
        userInfo: wechatUserInfo,
        isNewUser: false, // TODO: 判断是否新用户
      };
    } catch (error) {
      logger.error('微信登录失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败',
      };
    }
  }

  /**
   * 绑定或创建用户
   * 如果该微信号已绑定，返回绑定的用户
   * 如果未绑定，创建新用户并绑定
   * @param platform 平台
   * @param wechatUserInfo 微信用户信息
   * @returns 系统用户
   */
  async bindOrCreateUser(
    platform: WechatPlatform,
    wechatUserInfo: WechatUserInfo
  ): Promise<typeof user.$inferSelect> {
    logger.info('开始绑定或创建用户', { platform, openid: wechatUserInfo.openid });

    // 1. 查询是否已有绑定记录
    const existingBinding = await db
      .select()
      .from(userWechatBindings)
      .where(
        and(
          eq(userWechatBindings.platform, platform),
          eq(userWechatBindings.openid, wechatUserInfo.openid)
        )
      )
      .limit(1);

    if (existingBinding.length > 0) {
      // 已有绑定，查询用户信息
      const userId = existingBinding[0].userId;
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      if (existingUser.length > 0) {
        logger.info('找到已绑定用户', { userId });

        // 更新微信用户信息
        await db
          .update(userWechatBindings)
          .set({
            nickname: wechatUserInfo.nickname,
            avatar: wechatUserInfo.avatar,
            unionid: wechatUserInfo.unionid,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(userWechatBindings.id, existingBinding[0].id));

        return existingUser[0];
      }
    }

    // 2. 如果有 unionid，尝试查找其他平台的绑定（用于跨平台识别同一用户）
    if (wechatUserInfo.unionid) {
      const unionidBinding = await db
        .select()
        .from(userWechatBindings)
        .where(eq(userWechatBindings.unionid, wechatUserInfo.unionid))
        .limit(1);

      if (unionidBinding.length > 0) {
        // 找到同一用户在其他平台的绑定，为当前平台创建新绑定
        const userId = unionidBinding[0].userId;

        await db.insert(userWechatBindings).values({
          userId,
          platform,
          openid: wechatUserInfo.openid,
          unionid: wechatUserInfo.unionid,
          nickname: wechatUserInfo.nickname,
          avatar: wechatUserInfo.avatar,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        const existingUser = await db
          .select()
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);

        logger.info('为已有用户添加新平台绑定', { userId, platform });
        return existingUser[0];
      }
    }

    // 3. 创建新用户
    const newUserId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const newUser = await db
      .insert(user)
      .values({
        id: newUserId,
        email: `wechat_${wechatUserInfo.openid}@temp.lyricnote.com`, // 临时邮箱
        emailVerified: false,
        username: wechatUserInfo.nickname || `user_${Date.now()}`,
        name: wechatUserInfo.nickname,
        avatar: wechatUserInfo.avatar,
        role: 'USER',
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    // 4. 创建微信绑定记录
    await db.insert(userWechatBindings).values({
      userId: newUserId,
      platform,
      openid: wechatUserInfo.openid,
      unionid: wechatUserInfo.unionid,
      nickname: wechatUserInfo.nickname,
      avatar: wechatUserInfo.avatar,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    logger.info('创建新用户并绑定微信', { userId: newUserId, platform });
    return newUser[0];
  }

  /**
   * 刷新 access_token
   * @param refreshToken 刷新令牌
   * @returns 新的 access_token
   */
  async refreshToken(refreshToken: string): Promise<any> {
    // TODO: 实现刷新 token 逻辑
    logger.warn('refreshToken 方法尚未实现');
    throw new Error('refreshToken 方法尚未实现');
  }

  /**
   * 生成状态参数（用于防CSRF攻击）
   * @returns 随机状态字符串
   */
  private generateState(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * 生成认证 token（简化版本）
   * @param userId 用户 ID
   * @returns token
   */
  private generateToken(userId: string): string {
    // TODO: 实际应该生成 JWT
    return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
  }

  /**
   * 获取用户的微信绑定信息
   * @param userId 用户 ID
   * @returns 绑定列表
   */
  async getUserBindings(userId: string): Promise<WechatBinding[]> {
    const bindings = await db
      .select()
      .from(userWechatBindings)
      .where(eq(userWechatBindings.userId, userId));

    return bindings as WechatBinding[];
  }

  /**
   * 解绑微信账号
   * @param userId 用户 ID
   * @param platform 平台
   */
  async unbind(userId: string, platform: WechatPlatform): Promise<void> {
    await db
      .delete(userWechatBindings)
      .where(
        and(
          eq(userWechatBindings.userId, userId),
          eq(userWechatBindings.platform, platform)
        )
      );

    logger.info('解绑微信账号', { userId, platform });
  }
}

