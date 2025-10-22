/**
 * 应用配置常量
 * 这个文件包含了所有多端通用的应用配置信息
 * 可以通过修改这里的值来快速定制不同的应用
 */

// ==================== 应用基础信息 ====================
export const APP_CONFIG = {
  // 应用名称（可修改为其他项目名称）
  name: '通用标题1',

  // 应用全称
  fullName: '通用全称',

  // 应用图标emoji
  icon: '应用图标emoji',

  // 应用描述
  description: '通用描述',

  // 应用版本
  version: '1.0.0',

  // 开发团队
  author: '通用团队',

  // 版权信息
  copyright: `© ${new Date().getFullYear()} 通用版权`,
} as const;

// ==================== 应用标题文案 ====================
export const APP_TITLES = {
  // 主标题（带emoji）
  main: `${APP_CONFIG.icon} ${APP_CONFIG.name}`,

  // 管理后台标题
  admin: `${APP_CONFIG.name} 管理后台`,

  // 带版本号的标题
  withVersion: `${APP_CONFIG.name} v${APP_CONFIG.version}`,

  // 欢迎语
  welcome: `欢迎使用 ${APP_CONFIG.name}`,

  // 关于
  about: `关于${APP_CONFIG.name}`,
} as const;

// ==================== UI文案 ====================
export const UI_TEXT = {
  // 按钮文案
  buttons: {
    login: '登录',
    logout: '退出登录',
    register: '注册',
    submit: '提交',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    back: '返回',
    next: '下一步',
    finish: '完成',
    retry: '重试',
  },

  // 导航菜单
  navigation: {
    home: '首页',
    lyrics: '歌词',
    create: '创作',
    collection: '收藏',
    profile: '我的',
    settings: '设置',
    history: '历史',
  },

  // 状态提示
  status: {
    loading: '加载中...',
    success: '操作成功',
    error: '操作失败',
    empty: '暂无数据',
    networkError: '网络错误，请稍后重试',
  },

  // 表单提示
  form: {
    required: '必填项',
    emailInvalid: '邮箱格式不正确',
    passwordWeak: '密码强度不够',
    passwordNotMatch: '两次密码不一致',
  },
} as const;

// ==================== 页面配置 ====================
export const PAGE_CONFIG = {
  // 首页
  home: {
    title: '首页',
    description: `${APP_CONFIG.description}`,
  },

  // 个人中心
  profile: {
    title: '个人中心',
    description: '管理您的个人信息和偏好设置',
  },

  // 管理后台
  admin: {
    title: APP_TITLES.admin,
    description: '系统管理和数据统计',
  },

  // 登录页
  login: {
    title: '登录',
    description: `登录到 ${APP_CONFIG.name}`,
  },
} as const;

// ==================== API配置 ====================
export const API_CONFIG = {
  // API版本
  version: 'v1',

  // 超时时间
  timeout: 30000,

  // 请求头
  headers: {
    'Content-Type': 'application/json',
    'X-App-Name': APP_CONFIG.name,
    'X-App-Version': APP_CONFIG.version,
  },
} as const;

// ==================== 主题配置 ====================
export const THEME_CONFIG = {
  // 主题色
  primaryColor: '#5B8AFF',

  // 辅助色
  secondaryColor: '#FF6B9D',

  // 成功色
  successColor: '#52C41A',

  // 警告色
  warningColor: '#FAAD14',

  // 错误色
  errorColor: '#FF4D4F',

  // 文本颜色
  textPrimary: '#000000',
  textSecondary: '#666666',
  textDisabled: '#999999',

  // 背景色
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F5F5F5',
} as const;

// ==================== 业务常量 ====================
export const BUSINESS_CONFIG = {
  // 支持的歌词模式
  lyricModes: ['kanji', 'hiragana', 'romaji'] as const,

  // 默认歌词模式
  defaultLyricMode: 'kanji' as const,

  // 每页显示数量
  pageSize: 20,

  // 最大上传文件大小（MB）
  maxUploadSize: 10,

  // 支持的音频格式
  audioFormats: ['.mp3', '.wav', '.m4a', '.flac'],

  // 支持的图片格式
  imageFormats: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// ==================== 环境配置 ====================
export const ENV_CONFIG = {
  // 开发环境API地址
  dev: {
    apiUrl: 'http://localhost:3000/api',
    wsUrl: 'ws://localhost:3000',
  },

  // 生产环境API地址
  production: {
    apiUrl: 'https://api.lyricnote.app',
    wsUrl: 'wss://api.lyricnote.app',
  },
} as const;

// ==================== 导出所有配置 ====================
export const APP_CONSTANTS = {
  ...APP_CONFIG,
  titles: APP_TITLES,
  ui: UI_TEXT,
  pages: PAGE_CONFIG,
  api: API_CONFIG,
  theme: THEME_CONFIG,
  business: BUSINESS_CONFIG,
  env: ENV_CONFIG,
} as const;

// 默认导出
export default APP_CONSTANTS;
