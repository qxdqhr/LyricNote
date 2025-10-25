/**
 * 同步配置模板到数据库
 * POST /api/admin/config/sync-templates
 */

import { NextResponse } from 'next/server';
import { createAdminRoute } from '@/middleware';
import { configEngine } from '@/lib/config/config-engine';
import { NEW_CONFIG_TEMPLATES } from '@/lib/config/config-templates-new';
import type { ConfigDefinitionCreate } from '@/lib/config/config-types';

/**
 * POST /api/admin/config/sync-templates
 * 同步配置模板到 config_definitions 表
 */
export const POST = createAdminRoute(async (request, context) => {
  try {
    const userId = context.user?.id ? parseInt(context.user.id) : 0;
    const results: Array<{
      key: string;
      success: boolean;
      error?: string;
      action: 'created' | 'skipped' | 'failed';
    }> = [];

    // 遍历所有配置模板
    for (const [category, items] of Object.entries(NEW_CONFIG_TEMPLATES)) {
      for (const item of items) {
        try {
          // 检查是否已存在
          const existing = configEngine.getDefinition(item.key);

          if (existing) {
            results.push({
              key: item.key,
              success: true,
              action: 'skipped',
              error: '配置定义已存在',
            });
            continue;
          }

          // 创建配置定义
          const definition: ConfigDefinitionCreate = {
            key: item.key,
            category: item.category,
            name: item.description || item.key,
            description: item.description,
            type: item.type as any,
            uiComponent: 'input',
            isSensitive: item.isSensitive,
            isRequired: item.isRequired,
            isReadonly: false,
            defaultValue: item.defaultValue,
            groupName: (item as any).group,
            sortOrder: 0,
            version: 1,
            status: 'active',
          };

          await configEngine.registerDefinition(definition, userId);

          results.push({
            key: item.key,
            success: true,
            action: 'created',
          });
        } catch (error) {
          results.push({
            key: item.key,
            success: false,
            action: 'failed',
            error: error instanceof Error ? error.message : '未知错误',
          });
        }
      }
    }

    const createdCount = results.filter((r) => r.action === 'created').length;
    const skippedCount = results.filter((r) => r.action === 'skipped').length;
    const failedCount = results.filter((r) => r.action === 'failed').length;

    return NextResponse.json({
      success: true,
      message: `配置模板同步完成: 新建 ${createdCount} 个，跳过 ${skippedCount} 个，失败 ${failedCount} 个`,
      data: {
        total: results.length,
        created: createdCount,
        skipped: skippedCount,
        failed: failedCount,
        details: results,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '同步配置模板失败',
      },
      { status: 500 }
    );
  }
});
