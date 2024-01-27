import {
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm";

export const receipts = pgTable(
	'receipts',
	{
		id: varchar('id').primaryKey(),
		display_name: text('display_name'),
	}
);

export const receiptRelations = relations(receipts, ({ many }) => ({
	receiptsToSongs: many(receiptsToSongs),
}));

export const songs = pgTable(
	'songs',
	{
		id: varchar('id').primaryKey(),
		name: text('name'),
		url: text('url'),
		image: text('image'),
	}
);

export const songsRelations = relations(songs, ({ many }) => ({
	receiptsToSongs: many(receiptsToSongs),
	songsToArtists: many(songsToArtists),
}));

export const receiptsToSongs = pgTable(
	'receiptsToSongs',
	{
		song_id: varchar('song_id').notNull().references(() => songs.id),
		receipt_id: varchar('receipt_id').notNull().references(() => receipts.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.receipt_id, t.song_id] })
	})
);

export const receiptsToSongsRelations = relations(receiptsToSongs, ({ one }) => ({
	receipts: one(receipts, {
		fields: [receiptsToSongs.receipt_id],
		references: [receipts.id]
	}),
	songs: one(songs, {
		fields: [receiptsToSongs.song_id],
		references: [songs.id]
	})
}));

export const artists = pgTable(
	'artists',
	{
		id: varchar('id').primaryKey(),
		name: text('name'),
		url: text('url')
	}
);

export const artistRelations = relations(artists, ({ many }) => ({
	songsToArtists: many(songsToArtists),
}));

export const songsToArtists = pgTable(
	'songsToArtists',
	{
		song_id: varchar('song_id').notNull().references(() => songs.id),
		artist_id: varchar('artist_id').notNull().references(() => artists.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.song_id, t.artist_id] })
	})
);

export const songsToArtistsRelations = relations(songsToArtists, ({ one }) => ({
	songs: one(songs, {
		fields: [songsToArtists.song_id],
		references: [songs.id]
	}),
	artists: one(artists, {
		fields: [songsToArtists.artist_id],
		references: [artists.id]
	})
}))