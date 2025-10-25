/**
 * 微信扫码登录组件
 * 用于 Web 端展示微信登录二维码
 */

'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2 } from 'lucide-react';

interface WechatLoginProps {
  /** 登录成功回调 */
  onSuccess?: (data: any) => void;
  /** 登录失败回调 */
  onError?: (error: string) => void;
  /** 二维码尺寸 */
  size?: number;
}

/**
 * 微信扫码登录组件
 */
export function WechatLogin({ onSuccess, onError, size = 256 }: WechatLoginProps) {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    generateAuthUrl();
  }, []);

  /**
   * 生成授权 URL
   */
  const generateAuthUrl = async () => {
    try {
      setLoading(true);
      setError('');

      // 获取回调 URL
      const redirectUri = `${window.location.origin}/api/auth/wechat/callback`;
      const state = generateState();

      // 调用后端 API 获取授权 URL
      const response = await fetch('/api/auth/wechat/auth-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectUri,
          state,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '生成授权 URL 失败');
      }

      setAuthUrl(data.url);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成二维码失败';
      setError(errorMessage);
      setLoading(false);
      onError?.(errorMessage);
    }
  };

  /**
   * 生成状态参数
   */
  const generateState = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  /**
   * 刷新二维码
   */
  const handleRefresh = () => {
    generateAuthUrl();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">微信扫码登录</h3>

      {authUrl ? (
        <div className="relative">
          <QRCodeSVG
            value={authUrl}
            size={size}
            level="H"
            includeMargin
            className="border-4 border-gray-200 rounded-lg"
          />

          {/* Logo 图标（可选） */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="24" fill="#07C160" />
                <path
                  d="M16 20C16 16.686 18.686 14 22 14H26C29.314 14 32 16.686 32 20V28C32 31.314 29.314 34 26 34H22C18.686 34 16 31.314 16 28V20Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-sm text-gray-600 text-center">请使用微信扫描二维码登录</p>

      <button
        onClick={handleRefresh}
        className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
      >
        刷新二维码
      </button>
    </div>
  );
}
