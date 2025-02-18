import { CorsOptions } from '@/config/types'

export default (): CorsOptions => {
	const raw = <string>process.env.ENABLE_DOMAINS
	const domains = raw ? raw.split(',').map(domain => domain.trim()) : []
	const cookiesSecret = <string>process.env.COOKIES_SECRET

	return { domains, cookiesSecret }
}
