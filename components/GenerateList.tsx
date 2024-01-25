'use client'
import { getToken, type Song, type Artist } from "@/services/spotify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GenerateSkeleton from "./GenerateSkeleton";
import Image from "next/image";
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

	useEffect(() => {
		getToken(null).then((token) => {
			if (!token) {
				// User doesn't have token
				router.push("/");
			} else {
				getTopSongs(token).then((res) => {
					res.json().then((data) => {
						console.log(data.items);
						const songList: Song[] = data.items;
						setSongs(songList);
						setLoading(false);
					}).catch((e) => {
						// API call failed, return to index page
						router.push("/");
					});
				}).catch((e) => {
					// API failed, redirect to homepage
					router.push("/");
				})
			}
		});
	}, []);

	return (<>
		{loading ? <GenerateSkeleton /> : <SongList songs={songs!} />}
	</>)
}