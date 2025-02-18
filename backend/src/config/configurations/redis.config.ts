import { DEFAULT_HOST, DEFAULT_REDIS_P0RT, DEFAULT_REDIS_URI, DEFAULT_REDIS_USER } from '@/libs/common/constants'
import { RedisOptions } from 'ioredis'

export default (): RedisOptions => ({
	host: <string>process.env.REDIS_HOST || DEFAULT_HOST,
	port: <number>+process.env.REDIS_PORT || DEFAULT_REDIS_P0RT,
	username: <string>process.env.REDIS_USER || DEFAULT_REDIS_USER,
	password: <string>process.env.REDIS_PASSWORD,
	path: <string>`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${+process.env.REDIS_PORT}` || DEFAULT_REDIS_URI
})
