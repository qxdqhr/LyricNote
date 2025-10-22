import { NextRequest, NextResponse } from 'next/server';
import { createAdminRoute } from '@/middleware';
import { configEngine } from '@/lib/config/config-engine';

/**
 * GET /api/admin/config/[category]
 * 获取指定分类下的配置（使用 ConfigEngine V2）
 */
export const GET = createAdminRoute(async (request, context) => {
  try {
    const { category } = await context.params;

    // 使用 ConfigEngine 获取分类配置
    const configs = await configEngine.getConfigsWithValues(category);

    return NextResponse.json({
      success: true,
      data: {
        category,
        configs,
      },
    });
  } catch (error) {
    console.error('获取分类配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取分类配置失败',
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/config/[category]
 * 更新指定分类下的配置（使用 ConfigEngine V2）
 */
export const POST = createAdminRoute(async (request, context) => {
  try {
    const { category } = await context.params;
    const body = await request.json();
    const { configs } = body;
    const userId = context.user?.id ? parseInt(context.user.id) : 0;

    if (!configs || typeof configs !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: '配置数据格式错误',
        },
        { status: 400 }
      );
    }

    // 获取请求信息
    const ipAddress =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 获取当前配置（用于检测掩码值）
    const currentConfigsArray = await configEngine.getConfigsWithValues(category);
    const currentConfigsMap = new Map(currentConfigsArray.map((c) => [c.key, c]));

    // 过滤掉未修改的掩码值
    const updates: Array<{ key: string; value: any }> = [];
    let skippedCount = 0;

    for (const [key, value] of Object.entries(configs)) {
      const currentConfig = currentConfigsMap.get(key);

      // 如果是敏感配置且值是掩码值（未修改），则跳过
      if (
        currentConfig?.isSensitive &&
        typeof value === 'string' &&
        typeof currentConfig.displayValue === 'string'
      ) {
        // 简单检查：如果值等于 displayValue（掩码值），则跳过
        if (value === currentConfig.displayValue) {
          console.warn(`ℹ️  [Config] Skipping unchanged masked value for ${key}`);
          skippedCount++;
          continue;
        }
      }

      updates.push({ key, value });
    }

    // 批量设置配置（ConfigEngine 会自动验证）
    if (updates.length > 0) {
      await configEngine.setValues(updates, userId, {
        reason: body.reason,
        ipAddress,
        userAgent,
      });
      console.warn(`✅ [Config] Updated ${updates.length} configs in category ${category}`);
    }

    if (skippedCount > 0) {
      console.warn(`ℹ️  [Config] Skipped ${skippedCount} unchanged masked values`);
    }

    return NextResponse.json({
      success: true,
      message: `成功更新 ${updates.length} 个配置项${skippedCount > 0 ? `（跳过 ${skippedCount} 个未修改的敏感配置）` : ''}`,
    });
  } catch (error) {
    console.error('更新分类配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '更新分类配置失败',
      },
      { status: 500 }
    );
  }
});
