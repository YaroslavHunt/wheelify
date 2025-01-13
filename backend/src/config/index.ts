import appConfig from './app/app.config';
import dbConfig from './database/db.config';
import jwtConfig from './token/jwt.config';

export default () => ({
	app: appConfig(),
	database: dbConfig(),
	jwt: jwtConfig(),
});
