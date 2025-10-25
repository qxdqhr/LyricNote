/**
 * 微信支付组件
 * 用于 Web 端展示支付二维码
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { formatAmount } from '@lyricnote/shared';

interface WechatPaymentProps {
  /** 用户 ID */
  userId: string;
  /** 支付金额（单位：分） */
  amount: number;
  /** 商品名称 */
  productName: string;
  /** 商品 ID（可选） */
  productId?: string;
  /** 商品描述（可选） */
  description?: string;
  /** 支付成功回调 */
  onSuccess?: (orderId: string) => void;
  /** 支付失败回调 */
  onError?: (error: string) => void;
  /** 支付取消回调 */
  onCancel?: () => void;
}

type PaymentStatus = 'loading' | 'pending' | 'paid' | 'cancelled' | 'error';

/**
 * 微信支付组件
 */
export function WechatPayment({
  userId,
  amount,
  productName,
  productId,
  description,
  onSuccess,
  onError,
  onCancel,
}: WechatPaymentProps) {
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [orderId, setOrderId] = useState<string>('');
  const [codeUrl, setCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [polling, setPolling] = useState<boolean>(false);

  useEffect(() => {
    createPaymentOrder();
  }, []);

  useEffect(() => {
    // 如果订单创建成功，开始轮询查询订单状态
    if (orderId && status === 'pending') {
      setPolling(true);
      const timer = setInterval(() => {
        checkPaymentStatus();
      }, 3000); // 每 3 秒查询一次

      return () => {
        clearInterval(timer);
        setPolling(false);
      };
    }
  }, [orderId, status]);

  /**
   * 创建支付订单
   */
  const createPaymentOrder = async () => {
    try {
      setStatus('loading');
      setError('');

      const response = await fetch('/api/payment/wechat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          platform: 'web',
          amount,
          productName,
          productId,
          description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '创建订单失败');
      }

      setOrderId(data.orderId);
      setCodeUrl(data.codeUrl);
      setStatus('pending');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建订单失败';
      setError(errorMessage);
      setStatus('error');
      onError?.(errorMessage);
    }
  };

  /**
   * 查询支付状态
   */
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const response = await fetch(`/api/payment/wechat/query/${orderId}`);
      const data = await response.json();

      if (data.success && data.order) {
        const orderStatus = data.order.status;

        if (orderStatus === 'paid') {
          setStatus('paid');
          setPolling(false);
          onSuccess?.(orderId);
        } else if (orderStatus === 'cancelled') {
          setStatus('cancelled');
          setPolling(false);
          onCancel?.();
        }
      }
    } catch (err) {
      console.error('查询支付状态失败:', err);
    }
  }, [orderId, onSuccess, onCancel]);

  /**
   * 取消支付
   */
  const handleCancel = () => {
    setPolling(false);
    setStatus('cancelled');
    onCancel?.();
  };

  /**
   * 重试支付
   */
  const handleRetry = () => {
    createPaymentOrder();
  };

  // 加载中状态
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">正在创建订单...</p>
      </div>
    );
  }

  // 错误状态
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <XCircle className="w-12 h-12 text-red-600 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    );
  }

  // 支付成功状态
  if (status === 'paid') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg">
        <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">支付成功</h3>
        <p className="text-gray-600">订单号：{orderId}</p>
        <p className="text-lg font-semibold text-gray-800 mt-2">
          {formatAmount(amount)}
        </p>
      </div>
    );
  }

  // 支付取消状态
  if (status === 'cancelled') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <XCircle className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-600 mb-4">支付已取消</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新支付
        </button>
      </div>
    );
  }

  // 待支付状态
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">微信支付</h3>

      <div className="bg-blue-50 px-4 py-2 rounded-lg mb-4">
        <p className="text-sm text-gray-600">商品：{productName}</p>
        <p className="text-lg font-semibold text-gray-800">
          金额：{formatAmount(amount)}
        </p>
      </div>

      {codeUrl ? (
        <div className="relative mb-4">
          <QRCodeSVG
            value={codeUrl}
            size={256}
            level="H"
            includeMargin
            className="border-4 border-gray-200 rounded-lg"
          />

          {/* 微信 Logo */}
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

          {/* 轮询中的加载提示 */}
          {polling && (
            <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>等待支付</span>
            </div>
          )}
        </div>
      ) : null}

      <p className="text-sm text-gray-600 text-center mb-2">
        请使用微信扫描二维码完成支付
      </p>

      <p className="text-xs text-gray-500 mb-4">订单号：{orderId}</p>

      <button
        onClick={handleCancel}
        className="text-sm text-gray-600 hover:text-gray-800 underline"
      >
        取消支付
      </button>
    </div>
  );
}

