import { createHash } from "crypto"
import Cookies from "js-cookie";

const CLIENT_ID = 'ab5252ae6c094731a85194d903b3fb5d';
const SCOPES = [
	'user-top-read'
]
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

export type Album = {
	images: {height: number, url: string, width: number}[]
}

export type Artist = {
	external_urls: {spotify: string},
	href: string,
	name: string,
	id: string,
}

export type Song = {
	"external_urls": {"spotify": string},
	artists: Artist[],
	href: string,
	name: string,
	preview_url: string,
	duration_ms: number,
	id: string,
	uri: string,
	album: Album,
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