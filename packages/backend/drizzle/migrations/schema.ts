import {
  pgTable,
  uniqueIndex,
  text,
  boolean,
  jsonb,
  timestamp,
  foreignKey,
  index,
  integer,
  doublePrecision,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userRole = pgEnum('UserRole', ['USER', 'ADMIN', 'SUPER_ADMIN']);

export const user = pgTable(
  'User',
  {
    id: text().primaryKey().notNull(),
    email: text().notNull(),
    emailVerified: boolean().default(false).notNull(),
    username: text().notNull(),
    password: text(),
    name: text(),
    nickname: text(),
    image: text(),
    avatar: text(),
    role: userRole().default('USER').notNull(),
    preferences: jsonb(),
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
    twoFactorEnabled: boolean().default(false).notNull(),
  },
  (table) => [
    uniqueIndex('User_email_key').using('btree', table.email.asc().nullsLast().op('text_ops')),
    uniqueIndex('User_username_key').using(
      'btree',
      table.username.asc().nullsLast().op('text_ops')
    ),
  ]
);

export const session = pgTable(
  'Session',
  {
    id: text().primaryKey().notNull(),
    userId: text().notNull(),
    token: text().notNull(),
    expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex('Session_token_key').using('btree', table.token.asc().nullsLast().op('text_ops')),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'Session_userId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ]
);

export const account = pgTable(
  'Account',
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ precision: 3, mode: 'string' }),
    refreshTokenExpiresAt: timestamp({ precision: 3, mode: 'string' }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
  },
  (table) => [
    uniqueIndex('Account_providerId_accountId_key').using(
      'btree',
      table.providerId.asc().nullsLast().op('text_ops'),
      table.accountId.asc().nullsLast().op('text_ops')
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'Account_userId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ]
);

export const systemConfigs = pgTable(
  'system_configs',
  {
    id: text().primaryKey().notNull(),
    key: text().notNull(),
    value: jsonb().notNull(),
    description: text(),
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
  },
  (table) => [
    uniqueIndex('system_configs_key_key').using(
      'btree',
      table.key.asc().nullsLast().op('text_ops')
    ),
  ]
);

export const configMetadata = pgTable('config_metadata', {
  key: text().primaryKey().notNull(),
  category: text().notNull(),
  type: text().default('string').notNull(),
  isSensitive: boolean().default(false).notNull(),
  isRequired: boolean().default(false).notNull(),
  defaultDescription: text(),
  createdAt: timestamp({ precision: 3, mode: 'string' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
});

// 配置定义表（ConfigEngine 核心）
export const configDefinitions = pgTable(
  'config_definitions',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    key: text().notNull(),
    category: text().notNull(),
    name: text().notNull(),
    description: text(),

    // 类型和验证
    type: text().notNull(), // string, number, boolean, json, enum, url, email
    validationRules: jsonb(), // 验证规则 JSON

    // UI 配置
    uiComponent: text().default('input'), // input, textarea, select, switch, slider
    uiProps: jsonb(), // UI 组件属性

    // 安全和权限
    isSensitive: boolean().default(false).notNull(),
    isRequired: boolean().default(false).notNull(),
    isReadonly: boolean().default(false).notNull(),
    requiredPermission: text(),

    // 默认值和选项
    defaultValue: text(),
    enumOptions: jsonb(), // 枚举选项

    // 依赖和条件
    dependsOn: text().array(), // 依赖的配置项
    showIf: jsonb(), // 显示条件

    // 分组和排序
    groupName: text(),
    sortOrder: integer().default(0).notNull(),

    // 版本和状态
    version: integer().default(1).notNull(),
    status: text().default('active').notNull(), // active, deprecated, disabled

    // 标签
    tags: text().array(),

    // 元数据
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdBy: integer(),
  },
  (table) => [
    uniqueIndex('config_definitions_key_key').using(
      'btree',
      table.key.asc().nullsLast().op('text_ops')
    ),
    index('config_definitions_category_idx').using(
      'btree',
      table.category.asc().nullsLast().op('text_ops')
    ),
    index('config_definitions_status_idx').using(
      'btree',
      table.status.asc().nullsLast().op('text_ops')
    ),
  ]
);

// 配置变更历史表
export const configHistory = pgTable(
  'config_history',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    configKey: text().notNull(),
    oldValue: text(),
    newValue: text(),
    changeType: text().notNull(), // create, update, delete
    changedBy: integer(),
    changedAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    reason: text(),
    ipAddress: text(),
    userAgent: text(),
  },
  (table) => [
    index('config_history_key_idx').using(
      'btree',
      table.configKey.asc().nullsLast().op('text_ops')
    ),
    index('config_history_date_idx').using(
      'btree',
      table.changedAt.asc().nullsLast().op('timestamp_ops')
    ),
  ]
);

export const verifications = pgTable(
  'verifications',
  {
    id: text().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
    createdAt: timestamp({ precision: 3, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex('verifications_identifier_value_key').using(
      'btree',
      table.identifier.asc().nullsLast().op('text_ops'),
      table.value.asc().nullsLast().op('text_ops')
    ),
  ]
);

// 从 shared 包导入埋点事件表定义
// @ts-ignore - 临时忽略类型错误，等待 shared 包构建完成
import { analyticsEvents as baseAnalyticsEvents } from '@lyricnote/shared/analytics/server';

// 添加外键关系
export const analyticsEvents = baseAnalyticsEvents;
