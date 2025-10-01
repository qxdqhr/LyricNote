import React from 'react'
import { View, Text, ViewProps } from 'react-native'

interface AlertProps extends ViewProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  children: React.ReactNode
  icon?: React.ReactNode
}

const getVariantClasses = (variant: AlertProps['variant']) => {
  switch (variant) {
    case 'destructive':
      return 'bg-red-50 border-red-200'
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200'
    default:
      return 'bg-blue-50 border-blue-200'
  }
}

export function Alert({ 
  variant = 'default', 
  children, 
  icon,
  className = '', 
  style, 
  ...props 
}: AlertProps) {
  const variantClasses = getVariantClasses(variant)
  
  return (
    <View
      className={`p-4 rounded-lg border ${variantClasses} ${className}`}
      style={style}
      {...props}
    >
      <View className="flex-row">
        {icon && (
          <View className="mr-3 mt-0.5">
            {icon}
          </View>
        )}
        <View className="flex-1">
          {children}
        </View>
      </View>
    </View>
  )
}

interface AlertTitleProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'success' | 'warning'
}

const getTitleVariantClasses = (variant: AlertTitleProps['variant']) => {
  switch (variant) {
    case 'destructive':
      return 'text-red-800'
    case 'success':
      return 'text-green-800'
    case 'warning':
      return 'text-yellow-800'
    default:
      return 'text-blue-800'
  }
}

export function AlertTitle({ children, variant = 'default' }: AlertTitleProps) {
  const textClasses = getTitleVariantClasses(variant)
  
  return (
    <Text className={`font-medium ${textClasses}`}>
      {children}
    </Text>
  )
}

interface AlertDescriptionProps {
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'success' | 'warning'
}

const getDescriptionVariantClasses = (variant: AlertDescriptionProps['variant']) => {
  switch (variant) {
    case 'destructive':
      return 'text-red-700'
    case 'success':
      return 'text-green-700'
    case 'warning':
      return 'text-yellow-700'
    default:
      return 'text-blue-700'
  }
}

export function AlertDescription({ children, variant = 'default' }: AlertDescriptionProps) {
  const textClasses = getDescriptionVariantClasses(variant)
  
  return (
    <Text className={`text-sm ${textClasses} mt-1`}>
      {children}
    </Text>
  )
}
