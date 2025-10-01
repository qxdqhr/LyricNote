import { relations } from "drizzle-orm/relations";
import { user, session, account, songs, lyrics, userLyrics, collections, collectionSongs, favorites, recognitions } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	userLyrics: many(userLyrics),
	favorites: many(favorites),
	recognitions: many(recognitions),
	collections: many(collections),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const lyricsRelations = relations(lyrics, ({one, many}) => ({
	song: one(songs, {
		fields: [lyrics.songId],
		references: [songs.id]
	}),
	userLyrics: many(userLyrics),
}));

export const songsRelations = relations(songs, ({many}) => ({
	lyrics: many(lyrics),
	collectionSongs: many(collectionSongs),
	favorites: many(favorites),
	recognitions: many(recognitions),
}));

export const userLyricsRelations = relations(userLyrics, ({one}) => ({
	lyric: one(lyrics, {
		fields: [userLyrics.lyricId],
		references: [lyrics.id]
	}),
	user: one(user, {
		fields: [userLyrics.userId],
		references: [user.id]
	}),
}));

export const collectionSongsRelations = relations(collectionSongs, ({one}) => ({
	collection: one(collections, {
		fields: [collectionSongs.collectionId],
		references: [collections.id]
	}),
	song: one(songs, {
		fields: [collectionSongs.songId],
		references: [songs.id]
	}),
}));

export const collectionsRelations = relations(collections, ({one, many}) => ({
	collectionSongs: many(collectionSongs),
	user: one(user, {
		fields: [collections.userId],
		references: [user.id]
	}),
}));

export const favoritesRelations = relations(favorites, ({one}) => ({
	song: one(songs, {
		fields: [favorites.songId],
		references: [songs.id]
	}),
	user: one(user, {
		fields: [favorites.userId],
		references: [user.id]
	}),
}));

export const recognitionsRelations = relations(recognitions, ({one}) => ({
	song: one(songs, {
		fields: [recognitions.songId],
		references: [songs.id]
	}),
	user: one(user, {
		fields: [recognitions.userId],
		references: [user.id]
	}),
}));