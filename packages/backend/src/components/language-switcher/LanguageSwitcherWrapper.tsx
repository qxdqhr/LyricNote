/**
 * 语言切换器包装组件
 * 为 Backend (Next.js) 提供样式化的语言切换功能
 */

'use client';

import React from 'react';
import { LanguageSwitcher, type Locale } from '@lyricnote/shared';
import '@lyricnote/shared/dist/i18n/components/LanguageSwitcher.css';

interface LanguageSwitcherWrapperProps {
  variant?: 'buttons' | 'dropdown' | 'icon';
  className?: string;
}

/**
 * 语言切换器组件
 * 支持三种样式：按钮组、下拉菜单、图标按钮
 */
export function LanguageSwitcherWrapper({
  variant = 'buttons',
  className = '',
}: LanguageSwitcherWrapperProps) {
  const handleLanguageChange = async (locale: Locale) => {
    // 可选：保存到服务器
    try {
      await fetch('/api/user/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  return (
    <LanguageSwitcher
      variant={variant}
      className={className}
      onLanguageChange={handleLanguageChange}
    />
  );
}

export default LanguageSwitcherWrapper;

