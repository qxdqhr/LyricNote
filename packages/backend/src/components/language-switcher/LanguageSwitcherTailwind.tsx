/**
 * 基于 Tailwind CSS 的语言切换器
 * 专为 Backend (Next.js) 设计
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { Locale } from '@lyricnote/shared';

interface LanguageOption {
  locale: Locale;
  label: string;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { locale: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { locale: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { locale: 'en-US', label: 'English', flag: '🇺🇸' },
  { locale: 'ja-JP', label: '日本語', flag: '🇯🇵' },
];

interface LanguageSwitcherProps {
  variant?: 'buttons' | 'dropdown' | 'icon';
  className?: string;
}

/**
 * 按钮组样式
 */
export function LanguageSwitcherButtons({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.locale}
          onClick={() => setLocale(option.locale)}
          className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-200
            ${
              locale === option.locale
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }
          `}
          aria-label={option.label}
        >
          <span className="text-base leading-none">{option.flag}</span>
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * 下拉菜单样式
 */
export function LanguageSwitcherDropdown({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();
  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.locale === locale);

  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
      <label
        htmlFor="language-select"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {t('language.label')}
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="
          min-w-[160px] px-3 py-2 pr-8
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-lg text-sm
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          cursor-pointer
          appearance-none
          bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')]
          bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat
        "
        aria-label={t('language.label')}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.locale} value={option.locale}>
            {option.flag} {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * 图标按钮样式（带下拉菜单）
 */
export function LanguageSwitcherIcon({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.locale === locale);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center gap-1.5 px-3 py-2
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-lg
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
        "
        aria-label="Switch Language"
      >
        <span className="text-lg leading-none">{currentOption?.flag}</span>
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
            absolute top-full right-0 mt-2 min-w-[180px]
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            py-1
            z-50
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.locale}
              onClick={() => handleSelect(option.locale)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-sm
                transition-colors duration-150
                ${
                  locale === option.locale
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
              `}
            >
              <span className="text-lg leading-none">{option.flag}</span>
              <span className="flex-1 text-left">{option.label}</span>
              {locale === option.locale && (
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 主组件 - 根据 variant 自动选择样式
 */
export function LanguageSwitcher({ variant = 'icon', className }: LanguageSwitcherProps) {
  switch (variant) {
    case 'buttons':
      return <LanguageSwitcherButtons className={className} />;
    case 'dropdown':
      return <LanguageSwitcherDropdown className={className} />;
    case 'icon':
    default:
      return <LanguageSwitcherIcon className={className} />;
  }
}

export default LanguageSwitcher;
