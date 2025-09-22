import React from 'react';
import { TouchableOpacity, Text, View, TextStyle, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    };

    const variantStyle: ViewStyle = 
      variant === 'primary' ? { backgroundColor: '#8b5cf6' } :
      variant === 'secondary' ? { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#8b5cf6' } :
      { backgroundColor: 'transparent' };

    const sizeStyle: ViewStyle = 
      size === 'sm' ? { paddingHorizontal: 12, paddingVertical: 8 } :
      size === 'lg' ? { paddingHorizontal: 24, paddingVertical: 16 } :
      { paddingHorizontal: 16, paddingVertical: 12 };

    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      opacity: disabled ? 0.5 : 1,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const variantStyle: TextStyle = 
      variant === 'primary' ? { color: 'white' } :
      { color: '#8b5cf6' };

    const sizeStyle: TextStyle = 
      size === 'lg' ? { fontSize: 18 } :
      { fontSize: 16 };

    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={getButtonStyle()}
    >
      <Text style={getTextStyle()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};