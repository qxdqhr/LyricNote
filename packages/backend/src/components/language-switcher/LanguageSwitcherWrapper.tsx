/**
 * 语言切换器 - CSS 版本（备选方案）
 *
 * ⚠️ 注意：此组件使用独立的 CSS 文件，不依赖 Tailwind
 *
 * 推荐使用：LanguageSwitcherTailwind（默认导出）
 *
 * 使用场景：
 * - 需要在非 Tailwind 环境中使用
 * - 需要完全独立的样式（不受项目样式影响）
 * - 需要跨框架兼容性
 *
 * @deprecated 在 Backend 项目中，推荐使用 Tailwind 版本
 */

'use client';

import React from 'react';
import { LanguageSwitcher, type Locale } from '@lyricnote/shared';
import '@lyricnote/shared/i18n/components/LanguageSwitcher.css';

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
