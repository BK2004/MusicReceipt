/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: '/auth',
				destination: 'https://accounts.spotify.com/authorize',
				permanent: false,
			}
		]
	},
	reactStrictMode: false,
};

export default nextConfig;