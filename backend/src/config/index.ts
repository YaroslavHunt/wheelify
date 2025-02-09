import appConfig from './app/app.config';
import dbConfig from './database/db.config';
import jwtConfig from './token/jwt.config';
import adminConfig from './admin/admin.config';
import { MainConfig } from './config.types';
import securityConfig from './security/security.config';
import redisConfig from './redis/redis.config';

export default (): MainConfig => ({
	redis: redisConfig(),
	app: appConfig(),
	database: dbConfig(),
	jwt: jwtConfig(),
	admin: adminConfig(),
	security: securityConfig(),
});
