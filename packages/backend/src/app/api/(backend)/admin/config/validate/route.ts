import { NextResponse } from 'next/server';
import { createAdminRoute } from '@/middleware';

import { getConfigService } from '../../../../../../lib/config/config-service';

// POST /api/admin/config/validate - 验证配置
export const POST = createAdminRoute(async (request) => {
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json(
      {
        success: false,
        error: '缺少必要参数',
      },
      { status: 400 }
    );
  }

  const configService = getConfigService();

  try {
    // 验证配置值
    configService.validateConfig(key, value);

    return NextResponse.json({
      success: true,
      message: '配置验证通过',
    });
  } catch (error: any) {
    console.error('配置验证失败:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || '配置验证失败',
      },
      { status: 400 }
    );
  }
});
