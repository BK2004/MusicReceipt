import { Metadata } from "next";

import GenerateList from "@/components/GenerateList";

export const metadata: Metadata = {
	title: "Music Receipt - Generate",
	description: "Generate Music Receipt"
}

export default function Generate() {
	return (
		<GenerateList />
	);
}