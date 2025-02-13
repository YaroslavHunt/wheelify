import { RedisConfig } from '../types'
import { DEFAULT_HOST, DEFAULT_REDIS_URI, DEFAULT_REDIS_USER } from '@/libs/common/constants'

export default (): RedisConfig => ({
	host: <string> process.env.REDIS_HOST || DEFAULT_HOST,
	port: <number> +process.env.REDIS_PORT || 6379,
	username: <string> process.env.REDIS_USER || DEFAULT_REDIS_USER,
	password: <string> process.env.REDIS_PASSWORD,
	uri: <string> `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${+process.env.REDIS_PORT}` || DEFAULT_REDIS_URI
})
