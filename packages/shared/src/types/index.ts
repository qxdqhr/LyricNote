// 用户相关类型
export interface User {
  id: string
  email: string
  username: string
  nickname?: string
  avatar?: string
  role: UserRole
  preferences?: UserPreferences
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface UserPreferences {
  language: string
  defaultLyricMode: LyricMode
  autoTranslate: boolean
  enableKTVMode: boolean
  [key: string]: any
}

// 歌曲相关类型
export interface Song {
  id: string
  title: string
  artist: string
  album?: string
  duration?: number
  releaseYear?: number
  genre?: string
  coverUrl?: string
  audioUrl?: string
  isJapanese: boolean
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// 歌词相关类型
export interface Lyric {
  id: string
  songId: string
  content: string
  kanji?: string
  hiragana?: string
  romaji?: string
  translation?: string
  timeStamps?: LyricTimeStamp[]
  version: number
  status: LyricStatus
  createdAt: string
  updatedAt: string
}

export interface LyricTimeStamp {
  time: number
  text: string
}

export enum LyricStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING'
}

export type LyricMode = 'kanji' | 'hiragana' | 'romaji'

// 音乐识别相关类型
export interface Recognition {
  id: string
  userId?: string
  audioUrl: string
  songId?: string
  confidence?: number
  status: RecognitionStatus
  result?: Record<string, any>
  processTime?: number
  createdAt: string
}

export enum RecognitionStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT'
}

// 收藏相关类型
export interface Collection {
  id: string
  userId: string
  name: string
  description?: string
  isDefault: boolean
  isPublic: boolean
  category?: string
  createdAt: string
  updatedAt: string
}

export interface CollectionSong {
  id: string
  collectionId: string
  songId: string
  addedAt: string
  notes?: string
}

export interface Favorite {
  id: string
  userId: string
  songId: string
  createdAt: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      pages: number
    }
    [key: string]: any
  }
}

// 分页类型
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// AI 处理类型
export interface AIProcessLog {
  id: string
  type: string
  inputData: Record<string, any>
  outputData?: Record<string, any>
  apiProvider: string
  tokens?: number
  cost?: number
  duration?: number
  status: string
  error?: string
  createdAt: string
}

// 日语处理结果类型
export interface JapaneseLyricsResult {
  original: string
  kanji: string
  hiragana: string
  romaji: string
  translation?: string
}

export interface FuriganaResult {
  text: string
  reading: string
}

// 导航类型
export type RootStackParamList = {
  TabNavigator: undefined
}

export type TabParamList = {
  Home: undefined
  Lyrics: undefined
  Create: undefined
  Collection: undefined
  Profile: undefined
}

// 组件属性类型
export interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}

// 表单类型
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  email: string
  username: string
  password: string
  confirmPassword: string
  nickname?: string
}

// 系统配置类型
export interface SystemConfig {
  id: string
  key: string
  value: any
  description?: string
  createdAt: string
  updatedAt: string
}
