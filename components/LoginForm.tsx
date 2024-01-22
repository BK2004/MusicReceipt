'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SpotifyIcon from "@/public/spotify.png";
import { getAuthUrl } from "@/services/spotify";

export default function LoginForm() {
	const router = useRouter();

	const onClick = () => {
		const params = getAuthUrl();
		router.push(params);
	}

	return (<>
		<Image className="w-full max-w-72" src={SpotifyIcon} alt={"Spotify icon"} />
		<button className="bg-green-500 rounded-lg p-5 w-full max-w-72 text-2xl font-bold text-white hover:ring-green-500 hover:ring-4 transition-all duration-175 ease-in-out" onClick={onClick}>Login with <strong>Spotify</strong></button>
	</>);
}