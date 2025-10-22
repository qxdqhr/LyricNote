// 用户相关类型
export interface User {
  id: string;
  email: string;
  username: string;
  nickname?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    [key: string]: any;
  };
}

// 分页类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 导航类型
export type RootStackParamList = {
  TabNavigator: undefined;
};

export type TabParamList = {
  Home: undefined;
  Lyrics: undefined;
  Create: undefined;
  Collection: undefined;
  Profile: undefined;
};

// 组件属性类型
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

// 表单类型
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
}

// 系统配置类型
export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
