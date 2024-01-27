import { NextRequest, NextResponse } from "next/server";
import { generateReceipt } from "@/services/api";

export const GET = async (req: NextRequest) => {

}

export const POST = async (req: NextRequest) => {
	try {
		const data = await req.json();
		const res = await generateReceipt(data.songs, data.display_name);
		
		return NextResponse.json({ url: res });
	} catch(e) {
		return NextResponse.json({ error: 'Bad Gateway' }, { status: 502 });
	}
}