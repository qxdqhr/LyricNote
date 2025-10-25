/**
 * 通用导出服务数据库表定义
 */

import { pgTable, text, boolean, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

/**
 * 导出配置表
 */
export const exportConfigs = pgTable('ExportConfig', {
  id: text('id').primaryKey().$defaultFn(() => `export_config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  name: text('name').notNull(),
  description: text('description'),
  format: text('format').notNull(), // 'csv' | 'excel' | 'json'
  fields: jsonb('fields').notNull(), // ExportField[]
  grouping: jsonb('grouping'), // GroupingConfig
  fileNameTemplate: text('fileNameTemplate').notNull(),
  includeHeader: boolean('includeHeader').default(true).notNull(),
  delimiter: text('delimiter').default(',').notNull(),
  encoding: text('encoding').default('utf-8').notNull(),
  addBOM: boolean('addBOM').default(true).notNull(),
  maxRows: integer('maxRows'),
  moduleId: text('moduleId').notNull(),
  businessId: text('businessId'),
  createdBy: text('createdBy'),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

/**
 * 导出历史记录表
 */
export const exportHistory = pgTable('ExportHistory', {
  id: text('id').primaryKey().$defaultFn(() => `export_history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  configId: text('configId').notNull(),
  fileName: text('fileName').notNull(),
  fileSize: integer('fileSize').notNull(),
  exportedRows: integer('exportedRows').notNull(),
  status: text('status').notNull(), // 'pending' | 'processing' | 'completed' | 'failed'
  error: text('error'),
  duration: integer('duration'), // 毫秒
  startTime: timestamp('startTime', { precision: 3, mode: 'date' }).notNull(),
  endTime: timestamp('endTime', { precision: 3, mode: 'date' }),
  createdBy: text('createdBy'),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// 导出类型
export type ExportConfig = typeof exportConfigs.$inferSelect;
export type NewExportConfig = typeof exportConfigs.$inferInsert;
export type ExportHistory = typeof exportHistory.$inferSelect;
export type NewExportHistory = typeof exportHistory.$inferInsert;

// ============================================================================
// Relations 定义
// ============================================================================

/**
 * 导出配置表关系
 * 一个配置可以有多个导出历史记录
 */
export const exportConfigsRelations = relations(exportConfigs, ({ many }) => ({
  history: many(exportHistory),
}));

/**
 * 导出历史表关系
 * 每个历史记录关联一个配置
 */
export const exportHistoryRelations = relations(exportHistory, ({ one }) => ({
  config: one(exportConfigs, {
    fields: [exportHistory.configId],
    references: [exportConfigs.id],
  }),
}));
