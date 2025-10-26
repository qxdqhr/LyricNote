/**
 * 语言切换组件
 * 支持多种样式：按钮组、下拉菜单、图标按钮
 */

import React from 'react';
import { useTranslation } from '../hooks';
import type { Locale } from '../types';

// ==================== 类型定义 ====================

export interface LanguageSwitcherProps {
  variant?: 'buttons' | 'dropdown' | 'icon';
  className?: string;
  onLanguageChange?: (locale: Locale) => void;
}

export interface LanguageOption {
  locale: Locale;
  label: string;
  flag: string;
}

// ==================== 语言选项配置 ====================

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { locale: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { locale: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { locale: 'en-US', label: 'English', flag: '🇺🇸' },
  { locale: 'ja-JP', label: '日本語', flag: '🇯🇵' },
];

// ==================== 按钮组样式 ====================

/**
 * 按钮组语言切换器
 */
export function LanguageSwitcherButtons({
  className = '',
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  const handleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    onLanguageChange?.(newLocale);
  };

  return (
    <div className={`language-switcher-buttons ${className}`}>
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.locale}
          onClick={() => handleChange(option.locale)}
          className={`language-button ${locale === option.locale ? 'active' : ''}`}
          aria-label={option.label}
        >
          <span className="flag">{option.flag}</span>
          <span className="label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

// ==================== 下拉菜单样式 ====================

/**
 * 下拉菜单语言切换器
 */
export function LanguageSwitcherDropdown({
  className = '',
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    setLocale(newLocale);
    onLanguageChange?.(newLocale);
  };

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.locale === locale);

  return (
    <div className={`language-switcher-dropdown ${className}`}>
      <label htmlFor="language-select" className="language-label">
        {t('language.label')}
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={handleChange}
        className="language-select"
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

// ==================== 图标按钮样式 ====================

/**
 * 图标按钮语言切换器（带下拉菜单）
 */
export function LanguageSwitcherIcon({
  className = '',
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.locale === locale);

  const handleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    onLanguageChange?.(newLocale);
  };

  return (
    <div className={`language-switcher-icon ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-icon-button"
        aria-label="Switch Language"
      >
        <span className="current-flag">{currentOption?.flag}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown-menu">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.locale}
              onClick={() => handleChange(option.locale)}
              className={`language-dropdown-item ${locale === option.locale ? 'active' : ''}`}
            >
              <span className="flag">{option.flag}</span>
              <span className="label">{option.label}</span>
              {locale === option.locale && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * 语言切换器主组件
 * 根据 variant 自动选择样式
 */
export function LanguageSwitcher({
  variant = 'buttons',
  className,
  onLanguageChange,
}: LanguageSwitcherProps) {
  switch (variant) {
    case 'dropdown':
      return (
        <LanguageSwitcherDropdown
          className={className}
          onLanguageChange={onLanguageChange}
        />
      );
    case 'icon':
      return (
        <LanguageSwitcherIcon
          className={className}
          onLanguageChange={onLanguageChange}
        />
      );
    case 'buttons':
    default:
      return (
        <LanguageSwitcherButtons
          className={className}
          onLanguageChange={onLanguageChange}
        />
      );
  }
}

// ==================== 默认导出 ====================

export default LanguageSwitcher;

