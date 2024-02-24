import { createHash } from "crypto"
import Cookies from "js-cookie";

const CLIENT_ID = 'ab5252ae6c094731a85194d903b3fb5d';
const SCOPES = [
	'user-top-read'
]
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

export type Artist = {
	url: string,
	name: string,
	id: string,
}

export type Song = {
	url: string,
	artists: Artist[],
	name: string,
	image: string,
	id: string,
}

export const generateString = (length: number) => {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const values = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		values[i] = Math.floor(Math.random() * 63)
	}
	return values.reduce((acc: string, x: number) => acc + possible[x % possible.length], "");
}

export const getVerifier = () => {
	let codeVerifier = Cookies.get("code_verifier");
	if (codeVerifier == undefined) {
		codeVerifier = generateString(64);
		Cookies.set("code_verifier", codeVerifier!, {
			expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
		})
	}

	return codeVerifier;
}

export const getCodeChallenge = () => {
	const data = new TextEncoder().encode(getVerifier());
	const hash = createHash("sha256");
	hash.update(getVerifier());
	return btoa(hash.digest('binary')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export const getAuthUrl = () => {
	const pathname = window.location.origin;
	
	const params = {
		response_type: 'code',
		client_id: CLIENT_ID,
		scope: SCOPES.join(' '),
		code_challenge_method: 'S256',
		code_challenge: getCodeChallenge(),
		redirect_uri: pathname + '/',
	}

	return pathname + "/auth?" + new URLSearchParams(params).toString();
}

export const getToken = async (code: string | null) => {
	const token = Cookies.get('access_token');
	if (token || !code) {
		return token;
	}

	const codeVerifier = getVerifier();

	try {
		const body = await fetch(TOKEN_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				client_id: CLIENT_ID,
				grant_type: 'authorization_code',
				code,
				redirect_uri: window.location.origin + '/',
				code_verifier: codeVerifier,
			}),
		});
		const res = await body.json();

		if (res?.access_token) {
			// Access token present, save it in cookies
			Cookies.set('access_token', res.access_token, { expires: new Date(Date.now() + 60 * 60 * 1000) });
		}

		return res?.access_token;
	} catch(e) {} finally {
		return null;
	}
}

export const logOut = () => {
	// Removes display_name, access_token, and code_verifier cookies, effectively logging out the user
	Cookies.remove("display_name");
	Cookies.remove("access_token");
	Cookies.remove("code_verifier");
}

export const getDisplayName = async () => {
	const name = Cookies.get("display_name");
	const token = await getToken(null);
	if (!token) {
		// Clear name cookie if it's there; it shouldn't
		if (name) {
			Cookies.remove("display_name");
		}

		return null;
	}

	if (name) {
		return name;
	}

	try {
		const res = await fetch('https://api.spotify.com/v1/me', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const body = await res.json();

		if (body?.display_name) {
			// Display name was returned, set it in cookies and return it
			Cookies.set("display_name", body.display_name);
			return body.display_name;
		}
	} catch (e) {}

	return null;
}

export const beautifySongs = (songs: any[]) => {
	const output: Song[] = []

	songs.forEach((song) => {
		let artists: Artist[] = song.artists.map((artist: { external_urls: { spotify: string; }; name: string; id: string; }) => ({
			url: artist.external_urls.spotify as string,
			name: artist.name as string,
			id: artist.id as string,
		}))

		artists = artists.slice(0, Math.min(8, artists.length));
		output.push({
			image: song.album.images[0].url as string,
			id: song.id as string,
			name: song.name as string,
			url: song.external_urls.spotify as string,
			artists
		})
	});

	return output;
}