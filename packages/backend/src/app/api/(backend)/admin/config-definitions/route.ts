/**
 * 配置定义管理 API
 * 用于动态管理配置定义
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminRoute } from '@/middleware';
import { configEngine } from '@/lib/config/config-engine';
import type { ConfigDefinitionCreate } from '@/lib/config/config-types';

/**
 * GET /api/admin/config-definitions
 * 获取所有配置定义或指定分类的配置定义
 */
export const GET = createAdminRoute(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const definitions = category
      ? configEngine.getDefinitionsByCategory(category)
      : configEngine.getAllDefinitions();

    return NextResponse.json({
      success: true,
      data: definitions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取配置定义失败',
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/config-definitions
 * 创建单个配置定义
 */
export const POST = createAdminRoute(async (request, context) => {
  try {
    const body = (await request.json()) as ConfigDefinitionCreate;
    const userId = context.user?.id ? parseInt(context.user.id) : 0;

    // 验证必填字段
    if (!body.key || !body.category || !body.name || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必填字段: key, category, name, type',
        },
        { status: 400 }
      );
    }

    // 检查 key 是否已存在
    const existing = configEngine.getDefinition(body.key);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `配置 key "${body.key}" 已存在`,
        },
        { status: 400 }
      );
    }

    await configEngine.registerDefinition(body, userId);

    return NextResponse.json({
      success: true,
      message: '配置定义创建成功',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '创建配置定义失败',
      },
      { status: 500 }
    );
  }
});
