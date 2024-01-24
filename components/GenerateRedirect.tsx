import { useRouter } from "next/navigation";

import Image from "next/image";
import icon from "@/public/icon.svg";

export default function GenerateRedirect() {
	const router = useRouter();

	const onClick = () => {
		router.push("/generate");
	}

	return (<>
		<Image className="aspect-square w-full max-w-80" src={icon} alt={"Music Receipt Icon"} />
		<button className="bg-green-500 rounded-lg p-5 w-full max-w-96 text-2xl font-bold text-white hover:ring-green-500 hover:ring-4 transition-all duration-175 ease-in-out" onClick={onClick}>Generate Music Receipt</button>
	</>);
}