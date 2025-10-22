import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

const getVariantClasses = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'destructive':
      return 'bg-red-500 active:bg-red-600';
    case 'outline':
      return 'bg-transparent border border-gray-300 active:bg-gray-50';
    case 'secondary':
      return 'bg-gray-100 active:bg-gray-200';
    case 'ghost':
      return 'bg-transparent active:bg-gray-50';
    case 'link':
      return 'bg-transparent';
    default:
      return 'bg-purple-600 active:bg-purple-700';
  }
};

const getSizeClasses = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return 'h-9 px-3 rounded-md';
    case 'lg':
      return 'h-12 px-8 rounded-md';
    case 'icon':
      return 'h-10 w-10 rounded-md';
    default:
      return 'h-10 px-4 py-2 rounded-md';
  }
};

const getTextVariantClasses = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'destructive':
      return 'text-white font-medium';
    case 'outline':
      return 'text-gray-900 font-medium';
    case 'secondary':
      return 'text-gray-900 font-medium';
    case 'ghost':
      return 'text-gray-900 font-medium';
    case 'link':
      return 'text-purple-600 font-medium underline';
    default:
      return 'text-white font-medium';
  }
};

const getTextSizeClasses = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    default:
      return 'text-sm';
  }
};

export function Button({
  variant = 'default',
  size = 'default',
  children,
  loading = false,
  icon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const textVariantClasses = getTextVariantClasses(variant);
  const textSizeClasses = getTextSizeClasses(size);

  const buttonClasses = `
    flex-row items-center justify-center
    ${sizeClasses}
    ${variantClasses}
    ${disabled || loading ? 'opacity-50' : ''}
  `.trim();

  const textClasses = `
    ${textVariantClasses}
    ${textSizeClasses}
    ${icon ? 'ml-2' : ''}
  `.trim();

  return (
    <TouchableOpacity
      className={buttonClasses}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'secondary' || variant === 'ghost'
              ? '#6B7280'
              : 'white'
          }
        />
      )}
      {!loading && icon && icon}
      {!loading && <Text className={textClasses}>{children}</Text>}
    </TouchableOpacity>
  );
}
