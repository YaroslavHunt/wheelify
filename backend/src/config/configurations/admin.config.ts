import * as process from 'node:process'

import { AdministratorConfig } from '../types'
import { DEFAULT_ADMIN_USERNAME } from '@/libs/common/constants'

export default (): AdministratorConfig => ({
	username: <string> process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME,
	password: <string> process.env.ADMIN_PASSWORD,
	email: <string> process.env.ADMIN_EMAIL
})
