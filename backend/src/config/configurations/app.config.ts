import { Mode } from '@/libs/common/enums'
import { AppOptions } from '../types'
import {
	DEFAULT_CLIENT_URL,
	DEFAULT_GLOBAL_PREFIX,
	DEFAULT_HOST,
	DEFAULT_SERVER_PORT,
	DEFAULT_SERVER_URL
} from '@/libs/common/constants'

export default (): AppOptions => ({
	mode: <Mode>process.env.NODE_ENV || Mode.DEV,
	prefix: <string>process.env.APP_GLOBAL_PREFIX || DEFAULT_GLOBAL_PREFIX,
	host: <string>process.env.APP_HOST || DEFAULT_HOST,
	port: <number>+process.env.APP_PORT || DEFAULT_SERVER_PORT,
	url: <string>`http://${process.env.APP_HOST}:${+process.env.APP_PORT}` || DEFAULT_SERVER_URL,
	client: <string>process.env.ALLOWED_ORIGIN || DEFAULT_CLIENT_URL
})
