import { SecurityConfig } from '../types'
import * as process from 'node:process'

export default (): SecurityConfig => {
	const raw = <string> process.env.ENABLE_DOMAINS
	const domains = raw ? raw.split(',').map(domain => domain.trim()) : []
	const cookiesSecret = process.env.COOKIES_SECRET

	return { domains, cookiesSecret }
}
