import { type Song } from "@/services/spotify";
import Image from "next/image";

export default function SongFrame({ song }: { song: Song }) {
	return (<div key={song.id} className="w-full bg-slate-600 rounded-lg h-[6rem] mt-4 px-6 items-center align-middle flex justify-start gap-5">
		<Image src={song.image} width={80} height={80} alt={"Song image"} />
		<div className="title-artist h-[3rem] flex flex-col justify-between flex-1">
			<a href={song.url} className="text-white font-bold text-ellipsis whitespace-nowrap max-w-[60vw] w-fit overflow-hidden block hover:underline">{song.name}</a>
			<p className="text-white opacity-60 font-semibold overflow-hidden inline-block whitespace-nowrap text-ellipsis w-fit max-w-[_min(50vw,_400px)]">
				{song.artists.map((artist, idx) => {
					return (<span key={artist.id}><a className="hover:underline" href={artist.url}>{artist.name}</a>{idx != song.artists.length - 1 ? ", " : ""}</span>)
				})}
			</p>
		</div>
	</div>);
}