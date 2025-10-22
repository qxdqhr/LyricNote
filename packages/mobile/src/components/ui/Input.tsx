import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  rightIcon,
  className = '',
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputClasses = `
    h-10 px-3 py-2 rounded-md border text-sm
    ${error ? 'border-red-500' : isFocused ? 'border-purple-500' : 'border-gray-300'}
    ${error ? 'text-red-900' : 'text-gray-900'}
    bg-white
    ${className}
  `.trim();

  return (
    <View className="w-full">
      {label && <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>}

      <View className="relative">
        {icon && (
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">{icon}</View>
        )}

        <TextInput
          className={`${inputClasses} ${icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
          style={style}
          {...props}
        />

        {rightIcon && (
          <View className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            {rightIcon}
          </View>
        )}
      </View>

      {error && <Text className="text-sm text-red-600 mt-1">{error}</Text>}

      {helperText && !error && <Text className="text-sm text-gray-500 mt-1">{helperText}</Text>}
    </View>
  );
}
