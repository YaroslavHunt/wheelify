import appConfig from './configs/app.config';
import dbConfig from './configs/db.config';
import jwtConfig from './configs/jwt.config';
import adminConfig from './configs/admin.config';
import { MainConfig } from './config.types';
import securityConfig from './configs/security.config';
import redisConfig from './configs/redis.config';

export default (): MainConfig => ({
	redis: redisConfig(),
	app: appConfig(),
	database: dbConfig(),
	jwt: jwtConfig(),
	admin: adminConfig(),
	security: securityConfig(),
});
