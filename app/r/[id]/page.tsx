'use server'
import { getReceipt } from "@/services/api";

import Error404 from "@/components/404";
import SongList from "@/components/SongList";

const getData = async (id: string) => {
	try {
		const res = await getReceipt(id);
		if (res) {
			return res;
		}
	} catch (e) {
		return null;
	}
}

export default async function Page({ params }: { params: { id: string }}) {
	const data = await getData(params.id);

	return (data ? <SongList songs={data.songs} displayName={data.display_name} /> : <Error404 />);
}