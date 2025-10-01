#!/bin/bash

echo "🧹 开始清理剩余的 Prisma 代码..."

# 定义要处理的文件列表
files=(
    "packages/backend/src/app/api/admin/database-connection/route.ts"
    "packages/backend/src/app/api/admin/database-connection/test/route.ts"
    "packages/backend/src/lib/config/initialize-config.ts"
    "packages/backend/src/app/api/admin/config/validate/route.ts"
    "packages/backend/src/app/api/lyrics/route.ts"
)

# 备份原文件
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$file.backup"
        echo "✅ 备份了 $file"
    fi
done

echo "🎯 所有文件已备份完成"
echo "请手动检查并更新这些文件中的 Prisma 代码："

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📁 $file"
        grep -n "prisma\|@prisma\|PrismaClient" "$file" 2>/dev/null || echo "   (没有找到 Prisma 引用)"
    fi
done

echo ""
echo "🔧 建议的替换模式："
echo "1. import prisma -> import { db } from '@/lib/drizzle/db'"
echo "2. prisma.tableName.operation -> db.select/insert/update/delete"
echo "3. verifyAdminAuth -> DrizzleAuthService.requireAdmin"
echo "4. 添加必要的 Drizzle 导入和 crypto"
