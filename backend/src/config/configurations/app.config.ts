import * as process from 'node:process'

import { Mode } from '@/libs/common/enums'
import { AppConfig } from '../types'
import { DEFAULT_APP_URL, DEFAULT_HOST } from '@/libs/common/constants'

export default (): AppConfig => ({
	mode: <Mode>process.env.NODE_ENV || Mode.DEV,
	host: <string>process.env.APP_HOST || DEFAULT_HOST,
	port: <number>+process.env.APP_PORT || 4000,
	url: <string>`${process.env.APP_HOST}:${+process.env.APP_PORT}` || DEFAULT_APP_URL
})
