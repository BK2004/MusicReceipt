import { type Song } from "@/services/spotify";
import { useState } from "react";

import SongFrame from "./SongFrame";
import Image from "next/image";
import Share from "@/public/share.svg";

export default function SongList({ songs, displayName, generating, generatedUrl, generateUrl }: { songs: Song[], displayName: string, generating?: boolean, generatedUrl?: string | undefined, generateUrl?: () => void }) {
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	
	const onClick = () => {
		if (!modalVisible)
			generateUrl!();
		setModalVisible(!modalVisible);
	}
	
	return (<div className={"w-full max-w-4xl flex flex-col justify-start gap-4"}>
		<div className="text-green-500 text-4xl font-bold top-bar w-full flex justify-between">
			<h1 className="">{displayName}'s Music Receipt</h1>
			{ generateUrl ? <div className="relative">
				<Image onClick={onClick} src={Share} width={40} height={40} className="text-green-500 fill-green-500 hover:cursor-pointer" alt="share button image" />
				{modalVisible && (generating || generatedUrl !== undefined) ? <div className="generate-popup absolute w-fit p-3 right-0 bg-slate-900 text-lg rounded-md">
					{generating ? <p className="text-green-500 opacity-70">Generating...</p> : <p className="text-white opacity-70 bg-slate-800 rounded-md p-2">{`${window.location.origin}/r/${generatedUrl}`}</p>}
				</div> : ""}
			</div> : "" }
		</div>
		{songs!.map((song: Song) => {
			return (<SongFrame key={song.id} song={song} />);
		})}
	</div>);
}