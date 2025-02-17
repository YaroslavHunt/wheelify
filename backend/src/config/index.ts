import { Configurations } from './types'
import adminConfig from '@/config/configurations/admin.config'
import appConfig from '@/config/configurations/app.config'
import sequelizeConfig from '@/config/configurations/sequelize.config'
import jwtConfig from '@/config/configurations/jwt.config'
import redisConfig from '@/config/configurations/redis.config'
import securityConfig from '@/config/configurations/security.config'
import sessionConfig from '@/config/configurations/session.config'
import awsConfig from '@/config/configurations/aws.config'
import oauthConfig from '@/config/configurations/oauth.config'

export default (): Configurations => ({
	admin: adminConfig(),
	app: appConfig(),
	aws: awsConfig(),
	jwt: jwtConfig(),
	redis: redisConfig(),
	security: securityConfig(),
	sequelize: sequelizeConfig(),
	session: sessionConfig(),
	oauth: oauthConfig()
})
