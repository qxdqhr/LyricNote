import { NextResponse } from 'next/server';
import { createAdminRoute } from '@/middleware';
import { configEngine } from '@/lib/config/config-engine';
import { getDatabaseConfigForDisplay } from '../../../../../lib/config/database-config';

/**
 * GET /api/admin/config
 * 获取所有配置（使用 ConfigEngine V2）
 * 支持查询参数: ?category=xxx 获取指定分类的配置
 */
export const GET = createAdminRoute(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // 使用 ConfigEngine 获取配置（已包含定义和值，敏感信息已掩码）
    const configs = await configEngine.getConfigsWithValues(category || undefined);

    // 按分类分组，转换为对象格式（兼容前端）
    const grouped: Record<string, Record<string, any>> = {};
    configs.forEach((config) => {
      if (!grouped[config.category]) {
        grouped[config.category] = {};
      }
      // 将数组项转换为对象格式，使用 key 作为键
      grouped[config.category][config.key] = {
        key: config.key,
        value: config.displayValue ?? config.value, // 使用 displayValue（已掩码）
        type: config.type,
        isRequired: config.isRequired,
        isSensitive: config.isSensitive,
        description: config.description,
        defaultValue: config.defaultValue,
        readonly: config.isReadonly,
      };
    });

    // 为 database 分类添加数据库连接信息（只读显示）
    if (!category || category === 'database') {
      const databaseConnectionInfo = getDatabaseConfigForDisplay();

      if (!grouped.database) {
        grouped.database = {};
      }

      // 添加只读的数据库连接信息
      grouped.database = {
        database_connection_host: {
          key: 'database_connection_host',
          value: databaseConnectionInfo.host,
          type: 'string',
          isRequired: true,
          isSensitive: false,
          description: '数据库主机地址 (只读)',
          readonly: true,
        },
        database_connection_port: {
          key: 'database_connection_port',
          value: databaseConnectionInfo.port,
          type: 'number',
          isRequired: true,
          isSensitive: false,
          description: '数据库端口 (只读)',
          readonly: true,
        },
        database_connection_database: {
          key: 'database_connection_database',
          value: databaseConnectionInfo.database,
          type: 'string',
          isRequired: true,
          isSensitive: false,
          description: '数据库名称 (只读)',
          readonly: true,
        },
        database_connection_user: {
          key: 'database_connection_user',
          value: databaseConnectionInfo.user,
          type: 'string',
          isRequired: true,
          isSensitive: false,
          description: '数据库用户名 (只读)',
          readonly: true,
        },
        ...grouped.database, // 保留其他配置
      };
    }

    return NextResponse.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    console.error('获取配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取配置失败',
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/config
 * 创建或更新单个配置值（使用 ConfigEngine V2）
 */
export const POST = createAdminRoute(async (request, context) => {
  try {
    const body = await request.json();
    const { key, value } = body;
    const userId = context.user?.id ? parseInt(context.user.id) : 0;

    if (!key || value === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必填字段: key, value',
        },
        { status: 400 }
      );
    }

    // 获取请求信息用于历史记录
    const ipAddress =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await configEngine.setValue(key, value, userId, {
      reason: body.reason,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: '配置已保存',
    });
  } catch (error) {
    console.error('保存配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '保存配置失败',
      },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/admin/config
 * 批量更新配置值（使用 ConfigEngine V2）
 */
export const PUT = createAdminRoute(async (request, context) => {
  try {
    const body = await request.json();
    const { values } = body;
    const userId = context.user?.id ? parseInt(context.user.id) : 0;

    if (!Array.isArray(values) || values.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '请提供要更新的配置列表',
        },
        { status: 400 }
      );
    }

    // 获取请求信息
    const ipAddress =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await configEngine.setValues(values, userId, {
      reason: body.reason,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: `成功更新 ${values.length} 个配置`,
    });
  } catch (error) {
    console.error('批量更新配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '批量更新配置失败',
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/admin/config
 * 删除配置（暂不支持，保留配置定义但清空值）
 */
export const DELETE = createAdminRoute(async (request, context) => {
  return NextResponse.json(
    {
      success: false,
      error: '暂不支持删除配置，请使用配置定义管理界面',
    },
    { status: 400 }
  );
});
