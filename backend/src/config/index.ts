import appConfig from './app/app.config';
import dbConfig from './database/db.config';
import jwtConfig from './token/jwt.config';
import adminConfig from './admin/admin.config';
import { MainConfig } from './config.types';


export default (): MainConfig => ({
	app: appConfig(),
	database: dbConfig(),
	jwt: jwtConfig(),
	admin: adminConfig(),
});
