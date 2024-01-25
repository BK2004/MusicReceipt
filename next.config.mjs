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
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				port: '',
				pathname: '/image/**',
			}
		]
	},
	reactStrictMode: false,
};

export default nextConfig;