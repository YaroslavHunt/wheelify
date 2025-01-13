import appConfig from './app/app.config';
import dbConfig from './database/db.config';
import jwtConfig from './token/jwt.config';
import { AppConfig, DatabaseConfig, JwtConfig } from './config.types';

export interface Config {
	app: AppConfig;
	database: DatabaseConfig;
	jwt: JwtConfig;
}

export default (): Config => ({
	app: appConfig(),
	database: dbConfig(),
	jwt: jwtConfig(),
});
