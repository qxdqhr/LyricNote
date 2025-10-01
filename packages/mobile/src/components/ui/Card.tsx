import React from 'react'
import { View, Text, ViewProps, TextProps } from 'react-native'

// Card组件
interface CardProps extends ViewProps {
  children: React.ReactNode
}

export function Card({ children, className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  )
}

// CardHeader组件
interface CardHeaderProps extends ViewProps {
  children: React.ReactNode
}

export function CardHeader({ children, className = '', style, ...props }: CardHeaderProps) {
  return (
    <View
      className={`p-6 pb-0 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  )
}

// CardTitle组件
interface CardTitleProps extends TextProps {
  children: React.ReactNode
}

export function CardTitle({ children, className = '', style, ...props }: CardTitleProps) {
  return (
    <Text
      className={`text-lg font-semibold text-gray-900 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Text>
  )
}

// CardDescription组件
interface CardDescriptionProps extends TextProps {
  children: React.ReactNode
}

export function CardDescription({ children, className = '', style, ...props }: CardDescriptionProps) {
  return (
    <Text
      className={`text-sm text-gray-600 mt-1 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Text>
  )
}

// CardContent组件
interface CardContentProps extends ViewProps {
  children: React.ReactNode
}

export function CardContent({ children, className = '', style, ...props }: CardContentProps) {
  return (
    <View
      className={`p-6 pt-0 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  )
}

// CardFooter组件
interface CardFooterProps extends ViewProps {
  children: React.ReactNode
}

export function CardFooter({ children, className = '', style, ...props }: CardFooterProps) {
  return (
    <View
      className={`p-6 pt-0 flex-row items-center ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  )
}
