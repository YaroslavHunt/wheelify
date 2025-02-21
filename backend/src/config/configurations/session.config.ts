import { DEFAULT_HOST, DEFAULT_SESSION_MAX_AGE } from '@/libs/common/constants'
import { ms, StringValue } from '@/libs/common/utils/ms.utils'
import { SessionOptions } from 'express-session'
import * as process from 'node:process'
import { IS_DEV } from '@/libs/common/utils/is-dev.util'

export default (): SessionOptions => ({
	secret: <string>process.env.SESSION_SECRET,
	name: <string>process.env.SESSION_NAME,
	cookie: {
		domain: <string>process.env.SESSION_DOMAIN || DEFAULT_HOST,
		maxAge: ms(<StringValue>process.env.SESSION_MAX_AGE || DEFAULT_SESSION_MAX_AGE),
		httpOnly: process.env.SESSION_HTTP_ONLY === 'true',
		secure: !IS_DEV
	}
});