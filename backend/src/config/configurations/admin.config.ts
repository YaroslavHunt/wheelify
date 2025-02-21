import { AdministratorOptions } from '../types'
import { DEFAULT_ADMIN_USERNAME } from '@/libs/common/constants'

export default (): AdministratorOptions => ({
	username: <string>process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME,
	email: <string>process.env.ADMIN_EMAIL,
	password: <string>process.env.ADMIN_PASSWORD
})
