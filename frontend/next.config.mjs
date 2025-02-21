/** @type {import('next').NextConfig} */

const nextConfig = {
	experimental: {
		missingSuspenseWithCSRBailout: false
	},
	env: {
		SERVER_URL: process.env.SERVER_URL
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https:',
				hostname: 'lh3.googleusercontent.com'
			},
			{
				protocol: 'https:',
				hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
			}
		]
	}
}

export default nextConfig
