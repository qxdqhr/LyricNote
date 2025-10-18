/**
 * 埋点系统初始化
 * Analytics System Initialization
 */

import { createAnalyticsService, createAnalyticsHandlers } from '@lyricnote/shared/analytics/server';
import { db } from './drizzle/db';
import { analyticsEvents } from '../../drizzle/migrations/schema';
import { logger } from './logger';
import { NextResponse } from 'next/server';

// 创建服务实例
export const analyticsService = createAnalyticsService(db, analyticsEvents, logger);

// 创建 API 处理器
export const analyticsHandlers = createAnalyticsHandlers(analyticsService, NextResponse);

