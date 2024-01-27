import { Artist, type Song } from "./spotify";
import { db } from "./db";
import { artists, receipts, receiptsToSongs, songs, songsToArtists } from "./schema";
import { eq } from "drizzle-orm";

const CHOICES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV123456789";

export const generateReceipt = async (songList: Song[], displayName: string) => {
	// Validate given inputs
	let validSongs = true;
	songList.forEach(s => {
		if (!(s.name && s.artists && s.id && s.url && s.image)) {
			// Invalid
			validSongs = false;
			return;
		}

		s.artists.forEach(a => {
			if (!(a.name && a.id && a.url)) {
				// Artists invalid
				validSongs = false;
				return;
			}
		})
	});

	if (!validSongs) {
		throw "Invalid arguments given";
	}

	// Add or get artists for each song and connect them to their songs; generate receipt and create relations between receipt and all songs
	// Generate unique 6-char id to serve as url for receipt
	let random: string;
	do {
		random = "";
		for (let i = 0; i < 6; i++) {
			random = random + CHOICES[Math.floor(Math.random() * CHOICES.length)];
		} 
	} while ((await db.select().from(receipts).where(eq( receipts.id, random ))).length > 0);
	await db.insert(receipts).values({ id: random, display_name: displayName });

	// Insert all songs into songs table
	await db.insert(songs).values(songList.map(s => ({
		id: s.id,
		name: s.name,
		url: s.url,
		image: s.image
	}))).onConflictDoNothing({ target: [ songs.id ]});

	// Generate songs to artist, songs to receipt pairs, and artist entries
	const artistSongPairs: { artist_id: string, song_id: string }[] = [];
	const songReceiptPairs: { song_id: string, receipt_id: string }[] = [];
	const artistsToInsert: Artist[] = [];

	songList.forEach(s => {
		s.artists.forEach(a => {
			artistSongPairs.push({ artist_id: a.id, song_id: s.id });
			artistsToInsert.push(a);
		});
		songReceiptPairs.push({ song_id: s.id, receipt_id: random });
	});

	// Insert all relations into table
	await db.insert(artists).values(artistsToInsert).onConflictDoNothing({ target: [ artists.id ]});
	await db.insert(songsToArtists).values(artistSongPairs).onConflictDoNothing();
	await db.insert(receiptsToSongs).values(songReceiptPairs).onConflictDoNothing();

	return random;
}