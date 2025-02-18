import { Configurations } from './types'
import adminConfig from '@/config/configurations/admin.config'
import appConfig from '@/config/configurations/app.config'
import databaseConfig from '@/config/configurations/database.config'
import redisConfig from '@/config/configurations/redis.config'
import corsConfig from '@/config/configurations/cors.config'
import sessionConfig from '@/config/configurations/session.config'
import storageConfig from '@/config/configurations/storage.config'
import oauthConfig from '@/config/configurations/oauth.config'

export default (): Configurations => ({
	admin: adminConfig(),
	app: appConfig(),
	cors: corsConfig(),
	database: databaseConfig(),
	oauth: oauthConfig(),
	redis: redisConfig(),
	session: sessionConfig(),
	storage: storageConfig()
})
