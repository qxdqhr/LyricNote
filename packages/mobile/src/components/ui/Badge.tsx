import React from 'react'
import { View, Text, ViewProps } from 'react-native'

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
  children: React.ReactNode
}

const getVariantClasses = (variant: BadgeProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return 'bg-gray-100 border-gray-200'
    case 'destructive':
      return 'bg-red-100 border-red-200'
    case 'outline':
      return 'bg-transparent border-gray-300'
    case 'success':
      return 'bg-green-100 border-green-200'
    default:
      return 'bg-purple-100 border-purple-200'
  }
}

const getTextVariantClasses = (variant: BadgeProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return 'text-gray-800'
    case 'destructive':
      return 'text-red-800'
    case 'outline':
      return 'text-gray-700'
    case 'success':
      return 'text-green-800'
    default:
      return 'text-purple-800'
  }
}

export function Badge({ 
  variant = 'default', 
  children, 
  className = '', 
  style, 
  ...props 
}: BadgeProps) {
  const variantClasses = getVariantClasses(variant)
  const textVariantClasses = getTextVariantClasses(variant)
  
  return (
    <View
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium ${variantClasses} ${className}`}
      style={style}
      {...props}
    >
      <Text className={`text-xs font-medium ${textVariantClasses}`}>
        {children}
      </Text>
    </View>
  )
}
