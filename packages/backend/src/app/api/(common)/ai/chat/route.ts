import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, DrizzleAuthService } from '@/lib/auth/drizzle-auth';
import { getConfigService } from '@/lib/config/config-service';
import logger from '@/lib/logger';
import { addCorsHeaders, handleCorsPreFlight } from '@/lib/cors';

/**
 * OPTIONS /api/ai/chat
 * CORS 预检请求
 */
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request);
}

// POST /api/ai/chat - AI 聊天代理接口（需要登录）
export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const token = getTokenFromRequest(request);
    if (!token) {
      const response = NextResponse.json({ error: '未登录' }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    // 验证 token
    try {
      await DrizzleAuthService.verifyToken(token);
    } catch (error) {
      const response = NextResponse.json({ error: '登录已过期' }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    // 获取请求参数
    const body = await request.json();
    const { message, messages = [] } = body;

    if (!message) {
      const response = NextResponse.json({ error: '消息不能为空' }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    // 从配置中获取 AI 服务配置
    const configService = getConfigService();
    const aiApiKey = (await configService.getConfig('ai_model_api_key')) || '';
    const aiApiUrl = (await configService.getConfig('ai_model_api_base_url')) || '';
    const aiModel = (await configService.getConfig('ai_model_name')) || '';

    if (!aiApiKey) {
      const response = NextResponse.json(
        { error: 'AI API Key 未配置，请联系管理员在管理后台配置 ai_model_api_key' },
        { status: 500 }
      );
      return addCorsHeaders(response, request);
    }

    if (!aiApiUrl) {
      const response = NextResponse.json(
        { error: 'AI API URL 未配置，请联系管理员在管理后台配置 ai_model_api_base_url' },
        { status: 500 }
      );
      return addCorsHeaders(response, request);
    }

    if (!aiModel) {
      const response = NextResponse.json(
        { error: 'AI Model 未配置，请联系管理员在管理后台配置 ai_model_name' },
        { status: 500 }
      );
      return addCorsHeaders(response, request);
    }

    // 构建对话历史
    const chatMessages = [
      { role: 'user', content: '你是一个友好的 AI 助手。请用中文回答用户的问题。' },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // 调用 AI API
    // 添加请求日志
    logger.info('[AI Chat] 请求 AI API:', {
      url: aiApiUrl,
      model: aiModel,
      messages: chatMessages,
    });
    const response = await fetch(aiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: aiModel,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'AI API 调用失败');
    }

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      const response = NextResponse.json({
        success: true,
        data: {
          content: data.choices[0].message.content,
          model: aiModel,
        },
      });
      return addCorsHeaders(response, request);
    } else {
      throw new Error('Invalid response from AI');
    }
  } catch (error) {
    console.error('AI Chat error:', error);

    const response = NextResponse.json(
      {
        success: false,
        error: (error as any).message || 'AI 调用失败',
      },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}
