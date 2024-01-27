'use client'
import { getToken, getDisplayName, type Song, beautifySongs } from "@/services/spotify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { request } from "@/services/request";

import SongListSkeleton from "./SongListSkeleton";
import SongList from "./SongList";

const getTopSongs = (token: string) => {
	return fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export default function GenerateList() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [songs, setSongs] = useState<Song[] | undefined>(undefined);
	const [generating, setGenerating] = useState<boolean>(false);
	const [generatedUrl, setGeneratedUrl] = useState<string|undefined>(undefined);
	const [displayName, setDisplayName] = useState<string | undefined>(undefined);

	const generateUrl = () => {
		if (generatedUrl !== undefined || displayName === undefined) return;
		if (loading || songs?.length == 0) return;

		setGenerating(true);
		request.POST("/api/receipt", {
			songs,
			display_name: displayName
		}).then((res) => {
			res.json().then((data) => {
				if (data.url) {
					// Update generated url with given url
					setGeneratedUrl(data.url);
				}
			}).catch((e) => {});
		}).finally(() => setGenerating(false));
	}

	useEffect(() => {
		getToken(null).then((token) => {
			if (!token) {
				// User doesn't have token
				router.push("/");
			} else {
				getTopSongs(token).then((res) => {
					res.json().then((data) => {
						const songList: Song[] = beautifySongs(data.items);
						console.log(songList);
						setSongs(songList);

						// Songs loaded successfully, get display name
						getDisplayName().then((res) => {
							// Successfully loaded display name, update it and stop loading
							setDisplayName(res);
						}).catch((e) => {
							// Failed to retrieve name, back to index
							router.push("/");
						}).finally(() => setLoading(false));
					}).catch((e) => {
						// API returned bad data, return to index page
						router.push("/");
					});
				}).catch((e) => {
					// API request failed, redirect to homepage
					router.push("/");
				})
			}
		});
	}, []);

	return (<>
		{loading ? <SongListSkeleton /> : <SongList songs={songs!} displayName={displayName!} generating={generating} generatedUrl={generatedUrl} generateUrl={generateUrl} />}
	</>)
}