'use client'
import { getToken } from "@/services/spotify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GenerateSkeleton from "./GenerateSkeleton";

const getTopSongs = (token: string) => {
	return fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

export default function GenerateList() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [songs, setSongs] = useState(undefined);

	useEffect(() => {
		getToken(null).then((token) => {
			if (!token) {
				// User doesn't have token
				router.push("/");
			} else {
				getTopSongs(token).then((res) => {
					res.json().then((data) => console.log(data));
				}).catch((e) => {
					// API failed, redirect to homepage
					router.push("/");
				})
			}
		});
	}, []);

	return (<>
		{loading ? <GenerateSkeleton /> : ""}
	</>)
}