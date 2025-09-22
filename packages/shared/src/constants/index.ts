// API 相关常量
export const API_ENDPOINTS = {
  // 认证
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/users',
  
  // 音乐识别
  RECOGNITION: '/api/recognition',
  
  // 歌词
  LYRICS: '/api/lyrics',
  LYRICS_CONVERT: '/api/lyrics/convert',
  
  // 用户
  USERS: '/api/users',
  
  // 管理员
  ADMIN_STATS: '/api/admin/stats',
  
  // 健康检查
  HEALTH: '/api/health'
} as const

// 文本常量
export const TEXTS = {
  navigation: {
    home: '首页',
    lyrics: '歌词',
    create: '创作',
    collection: '收藏',
    profile: '我的',
  },
  
  home: {
    title: 'LyricNote',
    subtitle: '日语音乐识别专家',
    ktvMode: 'KTV模式',
    ktvModeDesc: '大字体歌词显示',
    tapToRecord: '轻触开始录音识别',
    recording: '录音中...',
    recognizing: 'AI识别中...',
    viewLyrics: '查看歌词 →',
  },
  
  lyrics: {
    title: '歌词同步',
    languageModes: {
      kanji: '汉字',
      hiragana: '平假名',
      romaji: '罗马音',
      learning: '学习模式',
    },
    playback: {
      play: '播放',
      pause: '暂停',
      reset: '重播',
      favorite: '收藏',
    }
  },
  
  collection: {
    title: '我的收藏',
    search: '搜索歌曲或艺术家',
    categories: {
      all: '全部',
      recent: '最近',
      favorites: '喜爱',
      playlists: '歌单',
    },
    empty: {
      title: '暂无歌曲',
      subtitle: '请尝试修改搜索条件或添加新歌曲',
    },
    stats: '共 {count} 首歌曲',
  },
  
  recognition: {
    status: {
      default: '识别日语音乐',
      recording: '录音中... ({count}秒)',
      recognizing: 'AI识别中...',
      success: '识别成功！',
      error: '识别失败，请重试',
    },
  },
  
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    share: '分享',
    loading: '加载中...',
    retry: '重试',
  }
} as const

// 应用配置常量
export const APP_CONFIG = {
  name: 'LyricNote',
  version: '1.0.0',
  description: '专注日语歌曲的AI智能听歌识曲应用',
  
  // 默认设置
  defaults: {
    lyricMode: 'kanji' as const,
    language: 'zh-CN',
    autoTranslate: true,
    enableKTVMode: false,
  },
  
  // 限制配置
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxRecordingTime: 30, // 30秒
    maxDailyRecognitions: 100,
    maxCollections: 20,
    maxSongsPerCollection: 500,
  },
  
  // 缓存配置
  cache: {
    userTTL: 3600, // 1小时
    lyricsTTL: 86400, // 24小时
    recognitionTTL: 3600, // 1小时
  },
  
  // 支持的文件类型
  supportedAudioTypes: [
    'audio/wav',
    'audio/mp3',
    'audio/m4a',
    'audio/aac',
    'audio/ogg'
  ],
  
  // 日语处理相关
  japanese: {
    supportedModes: ['kanji', 'hiragana', 'romaji'] as const,
    defaultMode: 'kanji' as const,
    enableFurigana: true,
    enableTranslation: true,
  },
  
  // UI 配置
  ui: {
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      gray: '#6b7280',
    },
    
    sizes: {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    },
    
    breakpoints: {
      mobile: 0,
      tablet: 768,
      desktop: 1024,
    }
  }
} as const

// 错误码常量
export const ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // 认证错误
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // 验证错误
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // 业务错误
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  SONG_NOT_FOUND: 'SONG_NOT_FOUND',
  LYRICS_NOT_FOUND: 'LYRICS_NOT_FOUND',
  RECOGNITION_FAILED: 'RECOGNITION_FAILED',
  
  // 文件错误
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  
  // 限制错误
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // AI 服务错误
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  AI_PROCESSING_FAILED: 'AI_PROCESSING_FAILED',
  AI_QUOTA_EXCEEDED: 'AI_QUOTA_EXCEEDED',
} as const

// 日语正则表达式
export const JAPANESE_REGEX = {
  hiragana: /[\u3040-\u309F]/,
  katakana: /[\u30A0-\u30FF]/,
  kanji: /[\u4E00-\u9FAF]/,
  japanese: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
  fullwidth: /[\uFF00-\uFFEF]/,
} as const

// 环境配置
export const ENV = {
  development: 'development',
  staging: 'staging',
  production: 'production',
} as const

// 存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  OFFLINE_DATA: 'offline_data',
} as const
