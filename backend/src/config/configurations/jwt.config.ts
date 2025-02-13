import { JwtConfig } from '../types'
import { DEFAULT_JWT_ACCESS_EXPIRE_TIME, DEFAULT_JWT_REFRESH_EXPIRE_TIME } from '@/libs/common/constants'

export default (): JwtConfig => ({
	secret: <string> process.env.JWT_SECRET,
	accessExpire: <string> process.env.JWT_ACCESS_EXPIRE_TIME || DEFAULT_JWT_ACCESS_EXPIRE_TIME,
	refreshExpire: <string> process.env.JWT_REFRESH_EXPIRE_TIME || DEFAULT_JWT_REFRESH_EXPIRE_TIME
})
