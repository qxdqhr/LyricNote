import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供有效的认证令牌' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      // 验证 token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      
      // 删除会话记录
      await prisma.session.deleteMany({
        where: {
          userId: decoded.userId,
          token
        }
      })

      return NextResponse.json({
        success: true,
        message: '退出登录成功'
      })

    } catch (jwtError) {
      // 即使 token 无效，也尝试删除会话
      await prisma.session.deleteMany({
        where: { token }
      })

      return NextResponse.json({
        success: true,
        message: '退出登录成功'
      })
    }

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: '退出登录失败' },
      { status: 500 }
    )
  }
}
