import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/db';
import { homepageSections } from '../../../../../drizzle/migrations/schema';
import { eq } from 'drizzle-orm';

// GET - 获取单个首页配置
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [section] = await db
      .select()
      .from(homepageSections)
      .where(eq(homepageSections.id, parseInt(params.id)))
      .limit(1);

    if (!section) {
      return NextResponse.json(
        { success: false, error: '首页配置不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    console.error('获取首页配置失败:', error);
    return NextResponse.json(
      { success: false, error: '获取首页配置失败' },
      { status: 500 }
    );
  }
}

// PATCH - 更新首页配置
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, backgroundImage, isActive } = body;

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage;
    if (isActive !== undefined) updateData.isActive = isActive;

    const [updatedSection] = await db
      .update(homepageSections)
      .set(updateData)
      .where(eq(homepageSections.id, parseInt(params.id)))
      .returning();

    if (!updatedSection) {
      return NextResponse.json(
        { success: false, error: '首页配置不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSection });
  } catch (error) {
    console.error('更新首页配置失败:', error);
    return NextResponse.json(
      { success: false, error: '更新首页配置失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除首页配置
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db
      .delete(homepageSections)
      .where(eq(homepageSections.id, parseInt(params.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除首页配置失败:', error);
    return NextResponse.json(
      { success: false, error: '删除首页配置失败' },
      { status: 500 }
    );
  }
}

