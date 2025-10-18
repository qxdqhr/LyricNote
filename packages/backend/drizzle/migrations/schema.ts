import { pgTable, uniqueIndex, text, boolean, jsonb, timestamp, foreignKey, index, integer, doublePrecision, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const lyricStatus = pgEnum("LyricStatus", ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING'])
export const recognitionStatus = pgEnum("RecognitionStatus", ['PROCESSING', 'SUCCESS', 'FAILED', 'TIMEOUT'])
export const userRole = pgEnum("UserRole", ['USER', 'ADMIN', 'SUPER_ADMIN'])


export const user = pgTable("User", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	emailVerified: boolean().default(false).notNull(),
	username: text().notNull(),
	password: text(),
	name: text(),
	nickname: text(),
	image: text(),
	avatar: text(),
	role: userRole().default('USER').notNull(),
	preferences: jsonb(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	twoFactorEnabled: boolean().default(false).notNull(),
}, (table) => [
	uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("User_username_key").using("btree", table.username.asc().nullsLast().op("text_ops")),
]);

export const session = pgTable("Session", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	token: text().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("Session_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Session_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const account = pgTable("Account", {
	id: text().primaryKey().notNull(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ precision: 3, mode: 'string' }),
	refreshTokenExpiresAt: timestamp({ precision: 3, mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("Account_providerId_accountId_key").using("btree", table.providerId.asc().nullsLast().op("text_ops"), table.accountId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Account_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const songs = pgTable("songs", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	artist: text().notNull(),
	album: text(),
	duration: integer(),
	releaseYear: integer(),
	genre: text(),
	coverUrl: text(),
	audioUrl: text(),
	isJapanese: boolean().default(true).notNull(),
	metadata: jsonb(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	index("songs_title_artist_idx").using("btree", table.title.asc().nullsLast().op("text_ops"), table.artist.asc().nullsLast().op("text_ops")),
]);

export const lyrics = pgTable("lyrics", {
	id: text().primaryKey().notNull(),
	songId: text().notNull(),
	content: text().notNull(),
	kanji: text(),
	hiragana: text(),
	romaji: text(),
	translation: text(),
	timeStamps: jsonb(),
	version: integer().default(1).notNull(),
	status: lyricStatus().default('PENDING').notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "lyrics_songId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userLyrics = pgTable("user_lyrics", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	lyricId: text().notNull(),
	content: text().notNull(),
	notes: text(),
	isPublic: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("user_lyrics_userId_lyricId_key").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.lyricId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.lyricId],
			foreignColumns: [lyrics.id],
			name: "user_lyrics_lyricId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_lyrics_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const collectionSongs = pgTable("collection_songs", {
	id: text().primaryKey().notNull(),
	collectionId: text().notNull(),
	songId: text().notNull(),
	addedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	notes: text(),
}, (table) => [
	uniqueIndex("collection_songs_collectionId_songId_key").using("btree", table.collectionId.asc().nullsLast().op("text_ops"), table.songId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.collectionId],
			foreignColumns: [collections.id],
			name: "collection_songs_collectionId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "collection_songs_songId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const favorites = pgTable("favorites", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	songId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("favorites_userId_songId_key").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.songId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "favorites_songId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "favorites_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const systemConfigs = pgTable("system_configs", {
	id: text().primaryKey().notNull(),
	key: text().notNull(),
	value: jsonb().notNull(),
	description: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("system_configs_key_key").using("btree", table.key.asc().nullsLast().op("text_ops")),
]);

export const recognitions = pgTable("recognitions", {
	id: text().primaryKey().notNull(),
	userId: text(),
	audioUrl: text().notNull(),
	songId: text(),
	confidence: doublePrecision(),
	status: recognitionStatus().notNull(),
	result: jsonb(),
	processTime: integer(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "recognitions_songId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "recognitions_userId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const aiProcessLogs = pgTable("ai_process_logs", {
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	inputData: jsonb().notNull(),
	outputData: jsonb(),
	apiProvider: text().notNull(),
	tokens: integer(),
	cost: doublePrecision(),
	duration: integer(),
	status: text().notNull(),
	error: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const collections = pgTable("collections", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	name: text().notNull(),
	description: text(),
	isDefault: boolean().default(false).notNull(),
	isPublic: boolean().default(false).notNull(),
	category: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "collections_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("verifications_identifier_value_key").using("btree", table.identifier.asc().nullsLast().op("text_ops"), table.value.asc().nullsLast().op("text_ops")),
]);

// 从 shared 包导入埋点事件表定义
// @ts-ignore - 临时忽略类型错误，等待 shared 包构建完成
import { analyticsEvents as baseAnalyticsEvents } from '@lyricnote/shared/analytics/server';

// 添加外键关系
export const analyticsEvents = baseAnalyticsEvents;
