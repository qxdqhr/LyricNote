import { pgTable, text, timestamp, boolean, json, integer, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// 用户角色枚举
export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN', 'SUPER_ADMIN'])

// 用户表
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  username: text('username').unique(),
  password: text('password'),
  name: text('name'),
  nickname: text('nickname'),
  image: text('image'),
  avatar: text('avatar'),
  role: userRoleEnum('role').default('USER').notNull(),
  preferences: json('preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
})

// 会话表 (Better-Auth 兼容)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 账户表 (Better-Auth 兼容)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 验证表 (Better-Auth 兼容)
export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 歌曲识别记录表
export const recognitions = pgTable('recognitions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  audioUrl: text('audio_url'),
  result: json('result'),
  confidence: integer('confidence'),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 歌曲表
export const songs = pgTable('songs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  album: text('album'),
  duration: integer('duration'),
  releaseDate: timestamp('release_date'),
  genre: text('genre'),
  language: text('language').default('ja'),
  spotifyId: text('spotify_id'),
  appleMusicId: text('apple_music_id'),
  youtubeId: text('youtube_id'),
  coverImageUrl: text('cover_image_url'),
  previewUrl: text('preview_url'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 歌词表
export const lyrics = pgTable('lyrics', {
  id: text('id').primaryKey(),
  songId: text('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  language: text('language').default('ja').notNull(),
  isOriginal: boolean('is_original').default(true).notNull(),
  translatedFrom: text('translated_from'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 用户歌词表 (用户创建的歌词)
export const userLyrics = pgTable('user_lyrics', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  songId: text('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  language: text('language').default('ja').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 收藏夹表
export const collections = pgTable('collections', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 收藏夹歌曲关联表
export const collectionSongs = pgTable('collection_songs', {
  id: text('id').primaryKey(),
  collectionId: text('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  songId: text('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
})

// 用户收藏表
export const favorites = pgTable('favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  songId: text('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 系统配置表
export const systemConfigs = pgTable('system_configs', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  isEncrypted: boolean('is_encrypted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 定义关系
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  recognitions: many(recognitions),
  collections: many(collections),
  favorites: many(favorites),
  userLyrics: many(userLyrics),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const recognitionsRelations = relations(recognitions, ({ one }) => ({
  user: one(users, {
    fields: [recognitions.userId],
    references: [users.id],
  }),
}))

export const songsRelations = relations(songs, ({ many }) => ({
  lyrics: many(lyrics),
  userLyrics: many(userLyrics),
  collectionSongs: many(collectionSongs),
  favorites: many(favorites),
}))

export const lyricsRelations = relations(lyrics, ({ one }) => ({
  song: one(songs, {
    fields: [lyrics.songId],
    references: [songs.id],
  }),
}))

export const userLyricsRelations = relations(userLyrics, ({ one }) => ({
  user: one(users, {
    fields: [userLyrics.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [userLyrics.songId],
    references: [songs.id],
  }),
}))

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  collectionSongs: many(collectionSongs),
}))

export const collectionSongsRelations = relations(collectionSongs, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionSongs.collectionId],
    references: [collections.id],
  }),
  song: one(songs, {
    fields: [collectionSongs.songId],
    references: [songs.id],
  }),
}))

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [favorites.songId],
    references: [songs.id],
  }),
}))

// 导出所有表的类型
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type Verification = typeof verifications.$inferSelect
export type NewVerification = typeof verifications.$inferInsert
export type Recognition = typeof recognitions.$inferSelect
export type NewRecognition = typeof recognitions.$inferInsert
export type Song = typeof songs.$inferSelect
export type NewSong = typeof songs.$inferInsert
export type Lyric = typeof lyrics.$inferSelect
export type NewLyric = typeof lyrics.$inferInsert
export type UserLyric = typeof userLyrics.$inferSelect
export type NewUserLyric = typeof userLyrics.$inferInsert
export type Collection = typeof collections.$inferSelect
export type NewCollection = typeof collections.$inferInsert
export type CollectionSong = typeof collectionSongs.$inferSelect
export type NewCollectionSong = typeof collectionSongs.$inferInsert
export type Favorite = typeof favorites.$inferSelect
export type NewFavorite = typeof favorites.$inferInsert
export type SystemConfig = typeof systemConfigs.$inferSelect
export type NewSystemConfig = typeof systemConfigs.$inferInsert
