import { SessionConfig } from '@/config/types'
import { DEFAULT_HOST, DEFAULT_SESSION_FOLDER, DEFAULT_SESSION_MAX_AGE } from '@/libs/common/constants'
import * as process from 'node:process'

export default (): SessionConfig => ({
		secret: <string> process.env.SESSION_SECRET,
		name: <string> process.env.SESSION_NAME,
		domain: <string> process.env.SESSION_DOMAIN || DEFAULT_HOST,
		maxAge: <string> process.env.SESSION_MAX_AGE || DEFAULT_SESSION_MAX_AGE,
		httpOnly: process.env.SESSION_HTTP_ONLY === 'true',
		secure: process.env.NODE_ENV === 'production',
		folder: <string> process.env.SESSION_FOLDER || DEFAULT_SESSION_FOLDER
})