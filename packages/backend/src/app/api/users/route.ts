import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/db'
import { user, session } from '../../../../drizzle/migrations/schema'
import { eq, or, ilike, count, desc } from 'drizzle-orm'
import { DrizzleAuthService } from '@/lib/auth/drizzle-auth'

// 用户注册 - 使用 DrizzleAuthService
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, nickname } = body

    // 验证必填字段
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: '邮箱、用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 验证密码强度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少6位' },
        { status: 400 }
      )
    }

    // 使用 DrizzleAuthService 注册用户
    const result = await DrizzleAuthService.signUp(email, password, username || nickname)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: (error as any).message || '注册失败，请重试' },
      { status: 500 }
    )
  }
}

// 获取用户列表（管理员功能）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const roleFilter = searchParams.get('role') || ''
    const offset = (page - 1) * limit

    // 构建查询条件
    let whereConditions = []

    if (search) {
      whereConditions.push(
        or(
          ilike(user.email, `%${search}%`),
          ilike(user.username, `%${search}%`),
          ilike(user.nickname, `%${search}%`)
        )
      )
    }

    if (roleFilter) {
      whereConditions.push(eq(user.role, roleFilter as any))
    }

    // 获取用户列表
    const usersQuery = db.select({
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }).from(user)

    if (whereConditions.length > 0) {
      usersQuery.where(whereConditions.length === 1 ? whereConditions[0] : or(...whereConditions))
    }

    const users = await usersQuery
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset)

    // 获取总数
    const totalQuery = db.select({ count: count() }).from(user)
    if (whereConditions.length > 0) {
      totalQuery.where(whereConditions.length === 1 ? whereConditions[0] : or(...whereConditions))
    }
    
    const [totalResult] = await totalQuery
    const total = totalResult?.count || 0

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    )
  }
}