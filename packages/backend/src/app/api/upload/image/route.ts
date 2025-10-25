import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getConfig } from '@/lib/config/config-service';
const OSS = require('ali-oss');

// 从配置管理加载 OSS 配置
async function getOSSConfig() {
  try {
    // 直接从配置服务加载
    const ossRegion = await getConfig('oss_region');
    const ossBucket = await getConfig('oss_bucket_name');
    const ossAccessKeyId = await getConfig('oss_access_key_id');
    const ossAccessKeySecret = await getConfig('oss_access_key_secret');
    const ossEndpoint = await getConfig('oss_endpoint');
    const ossPathPrefix = await getConfig('oss_path_prefix');

    // 调试：查看实际获取的值
    console.log('🔍 OSS 配置调试:', {
      region: ossRegion,
      bucket: ossBucket,
      accessKeyId: ossAccessKeyId,
      secretLength: ossAccessKeySecret?.length,
      secretPreview: ossAccessKeySecret?.substring(0, 10) + '...',
      endpoint: ossEndpoint,
      pathPrefix: ossPathPrefix,
    });

    // 检查 OSS 配置是否完整
    if (ossRegion && ossBucket && ossAccessKeyId && ossAccessKeySecret) {
      console.log('✅ OSS 配置已加载:', {
        region: ossRegion,
        bucket: ossBucket,
        hasAccessKey: !!ossAccessKeyId,
        hasSecret: !!ossAccessKeySecret,
      });

      return {
        region: ossRegion,
        bucket: ossBucket,
        accessKeyId: ossAccessKeyId,
        accessKeySecret: ossAccessKeySecret,
        endpoint: ossEndpoint,
        pathPrefix: ossPathPrefix,
      };
    }

    console.log('❌ OSS 配置不完整');
    return null;
  } catch (error) {
    console.error('获取 OSS 配置失败:', error);
    return null;
  }
}

// 上传到阿里云 OSS
async function uploadToOSS(buffer: Buffer, filename: string, ossConfig: any) {
  try {
    const client = new OSS({
      region: ossConfig.region,
      bucket: ossConfig.bucket,
      accessKeyId: ossConfig.accessKeyId,
      accessKeySecret: ossConfig.accessKeySecret,
      ...(ossConfig.endpoint && { endpoint: ossConfig.endpoint }),
    });

    // 使用项目前缀，确保不同项目文件分开存储
    const path = `${ossConfig.pathPrefix}/homepage/backgrounds/${filename}`;
    const result = await client.put(path, buffer);

    // 返回 OSS URL（强制使用 HTTPS）
    let ossUrl =
      result.url || `https://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com/${path}`;
    // 确保使用 HTTPS
    ossUrl = ossUrl.replace(/^http:\/\//i, 'https://');
    return ossUrl;
  } catch (error) {
    console.error('上传到 OSS 失败:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: '未找到文件' }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: '不支持的文件类型' }, { status: 400 });
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: '文件大小不能超过 10MB' }, { status: 400 });
    }

    // 读取文件数据
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成文件名（使用时间戳 + 随机字符串 + MD5）
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${random}-${hash.substring(0, 8)}.${ext}`;

    // 获取 OSS 配置
    const ossConfig = await getOSSConfig();

    if (!ossConfig) {
      console.error('❌ OSS 配置未设置或不完整');
      return NextResponse.json(
        { success: false, error: 'OSS 配置未设置，请先在配置管理中配置 OSS 存储' },
        { status: 500 }
      );
    }

    // 上传到 OSS
    console.log('✅ 使用 OSS 存储');
    const url = await uploadToOSS(buffer, filename, ossConfig);

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
        size: file.size,
        type: file.type,
        storageType: 'oss',
      },
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json({ success: false, error: '文件上传失败' }, { status: 500 });
  }
}
