import { type Song } from "@/services/spotify";

import Image from "next/image";

export default function SongList({ songs }: { songs: Song[] }) {
	return (<div className={"w-full max-w-4xl flex flex-col justify-start gap-4"}>{songs!.map((song: Song) => {
		return (<div key={song.id} className="w-full bg-slate-600 rounded-lg h-[6rem] px-6 items-center align-middle flex justify-start gap-5">
			<Image src={song.album.images[1].url} width={80} height={80} alt={"Song image"} />
			<div className="title-artist h-[3rem] flex flex-col justify-between flex-1">
				<a href={song.external_urls.spotify} className="text-white font-bold text-ellipsis whitespace-nowrap w-[60vw] overflow-hidden block hover:underline">{song.name}</a>
				<p className="text-white opacity-60 font-semibold overflow-hidden  inline-block whitespace-nowrap text-ellipsis w-[_min(50vw,_400px)]">
					{song.artists.map((artist, idx) => {
						return (`${artist.name}${(idx != song.artists.length - 1) ? ", " : ""}`)
					})}
				</p>
			</div>
		</div>)})}
	</div>);
}