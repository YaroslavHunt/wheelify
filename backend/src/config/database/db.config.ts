import { DatabaseConfig } from '../config.types';
import * as process from 'node:process';

export default (): DatabaseConfig => ({
		host: process.env.DB_HOST || 'localhost',
		port: +process.env.DB_PORT,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
});
