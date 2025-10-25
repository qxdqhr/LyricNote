import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/db';
import { homepageSections } from '../../../../drizzle/migrations/schema';
import { eq, asc } from 'drizzle-orm';

// GET - 获取所有首页配置
export async function GET() {
  try {
    const sections = await db
      .select()
      .from(homepageSections)
      .where(eq(homepageSections.isActive, true))
      .orderBy(asc(homepageSections.order));

    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    console.error('获取首页配置失败:', error);
    return NextResponse.json(
      { success: false, error: '获取首页配置失败' },
      { status: 500 }
    );
  }
}

// POST - 创建新的首页配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, backgroundImage, order } = body;

    const [newSection] = await db
      .insert(homepageSections)
      .values({
        title,
        description,
        backgroundImage,
        order: order || 0,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ success: true, data: newSection });
  } catch (error) {
    console.error('创建首页配置失败:', error);
    return NextResponse.json(
      { success: false, error: '创建首页配置失败' },
      { status: 500 }
    );
  }
}

// PUT - 批量更新顺序
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections } = body; // [{ id, order }]

    // 批量更新顺序
    for (const section of sections) {
      await db
        .update(homepageSections)
        .set({ order: section.order, updatedAt: new Date().toISOString() })
        .where(eq(homepageSections.id, section.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新首页配置顺序失败:', error);
    return NextResponse.json(
      { success: false, error: '更新首页配置顺序失败' },
      { status: 500 }
    );
  }
}

