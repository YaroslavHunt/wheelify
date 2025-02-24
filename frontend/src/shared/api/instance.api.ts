import { FetchClient } from '@/shared/utils'

export const api = new FetchClient({
	baseUrl: process.env.SERVER_URL as string,
	options: {
		credentials: 'include' // for cookies
	}
})