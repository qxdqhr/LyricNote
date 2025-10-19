import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker deployment configuration
  output: 'standalone',
  
  // Workspace configuration
  outputFileTracingRoot: process.env.NODE_ENV === 'production' ? undefined : '../../',
  
  // Skip lint and TypeScript checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // CORS 配置已移至路由级别（见 src/lib/cors.ts）
  // 这样可以根据不同的 API 精确控制 CORS，并支持 credentials
  // 全局通配符 '*' 与 credentials: 'include' 不兼容
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
