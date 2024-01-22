'use client'
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LoginForm from "@/components/LoginForm";
import { getToken } from "@/services/spotify";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | undefined>(undefined);
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get('code');

	useEffect(() => {
		// Gets new token if code is present or old code if present in cookies
		getToken(code).then((token) => {
			setToken(token);
			setLoading(false);
			router.replace('/')
		}).catch((e) => {
			setLoading(false);
			console.warn(e);
		});
	}, []);

	return (<>
		{loading || token !== undefined ? "" : <LoginForm />}
	</>);
}