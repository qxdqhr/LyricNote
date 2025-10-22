/**
 * 配置定义批量操作 API
 * 用于批量导入配置定义
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminRoute } from '@/middleware';
import { configEngine } from '@/lib/config/config-engine';
import type { ConfigDefinitionCreate, BatchRegisterRequest } from '@/lib/config/config-types';

/**
 * POST /api/admin/config-definitions/batch
 * 批量创建配置定义
 */
export const POST = createAdminRoute(async (request, context) => {
  try {
    const body = (await request.json()) as BatchRegisterRequest;
    const userId = context.user?.id ? parseInt(context.user.id) : 0;

    if (!body.definitions || !Array.isArray(body.definitions)) {
      return NextResponse.json(
        {
          success: false,
          error: '请提供 definitions 数组',
        },
        { status: 400 }
      );
    }

    const results: Array<{
      key: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const definition of body.definitions) {
      try {
        // 验证必填字段
        if (!definition.key || !definition.category || !definition.name || !definition.type) {
          results.push({
            key: definition.key || 'unknown',
            success: false,
            error: '缺少必填字段',
          });
          continue;
        }

        // 检查是否已存在
        const existing = configEngine.getDefinition(definition.key);
        if (existing) {
          results.push({
            key: definition.key,
            success: false,
            error: '配置已存在，跳过',
          });
          continue;
        }

        await configEngine.registerDefinition(definition, userId);
        results.push({
          key: definition.key,
          success: true,
        });
      } catch (error) {
        results.push({
          key: definition.key,
          success: false,
          error: error instanceof Error ? error.message : '未知错误',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `批量导入完成: 成功 ${successCount} 个，失败 ${failCount} 个`,
      data: {
        total: results.length,
        success: successCount,
        failed: failCount,
        details: results,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '批量导入失败',
      },
      { status: 500 }
    );
  }
});
