'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APP_TITLES } from '@lyricnote/shared';

export default function AdminRedirect() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 异步检查登录状态，不阻塞渲染
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // 已登录，直接跳转到仪表板
          router.replace('/admin/config');
        } else {
          // 未登录，跳转到登录页面
          router.replace('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/admin/login');
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // 显示加载状态
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
          <span className="text-3xl">🎌</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{APP_TITLES.admin}</h1>
        <p className="text-gray-600 mb-4">正在跳转...</p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
